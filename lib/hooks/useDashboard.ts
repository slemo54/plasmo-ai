'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase';

export function useDashboard() {
  const [stats, setStats] = useState<{
    totalVideos: number;
    creditsUsed: number;
    avgGenTime: string;
    recentVideos: any[];
  }>({
    totalVideos: 0,
    creditsUsed: 0,
    avgGenTime: '0s',
    recentVideos: [],
  });
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch stats
        const { data: statsData } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        // Fetch recent videos
        const { data: videos } = await supabase
          .from('video_generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(8);

        setStats({
          totalVideos: statsData?.total_videos || 0,
          creditsUsed: statsData?.total_credits_spent || 0,
          avgGenTime: statsData?.avg_generation_time 
            ? `${Math.floor(statsData.avg_generation_time / 60)}m ${statsData.avg_generation_time % 60}s`
            : '0s',
          recentVideos: videos || [],
        });
      } catch (error) {
        console.error('Error fetching dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [supabase]);

  return { stats, loading };
}
