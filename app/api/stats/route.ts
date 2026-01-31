import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }

    // Get user profile for credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Errore nel recupero profilo:', profileError)
    }

    // Get or create user stats
    let { data: stats, error: statsError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // If stats don't exist, calculate from video_generations
    if (statsError || !stats) {
      const { data: videos, error: videosError } = await supabase
        .from('video_generations')
        .select('credits_used, created_at, generation_time')
        .eq('user_id', user.id)
        .eq('status', 'completed')

      if (videosError) {
        console.error('Errore nel recupero video:', videosError)
      }

      const totalVideos = videos?.length || 0
      const totalCreditsSpent = videos?.reduce((sum, v) => sum + (v.credits_used || 0), 0) || 0
      
      // Calculate this week videos
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const thisWeekVideos = videos?.filter(v => new Date(v.created_at) >= oneWeekAgo).length || 0

      // Calculate this month credits
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      const thisMonthCredits = videos
        ?.filter(v => new Date(v.created_at) >= oneMonthAgo)
        .reduce((sum, v) => sum + (v.credits_used || 0), 0) || 0

      // Calculate average generation time
      const generationTimes = videos?.map(v => v.generation_time).filter(Boolean) as number[] || []
      const avgGenerationTime = generationTimes.length > 0
        ? Math.round(generationTimes.reduce((sum, t) => sum + t, 0) / generationTimes.length)
        : undefined

      // Create stats record
      const { data: newStats, error: insertError } = await supabase
        .from('user_stats')
        .upsert({
          user_id: user.id,
          total_videos: totalVideos,
          total_credits_spent: totalCreditsSpent,
          this_week_videos: thisWeekVideos,
          this_month_credits: thisMonthCredits,
          avg_generation_time: avgGenerationTime,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('Errore nella creazione stats:', insertError)
      } else {
        stats = newStats
      }
    }

    const dashboardStats = {
      credits: profile?.credits || 0,
      totalVideos: stats?.total_videos || 0,
      thisWeekVideos: stats?.this_week_videos || 0,
      totalCreditsSpent: stats?.total_credits_spent || 0,
      thisMonthCredits: stats?.this_month_credits || 0,
      avgGenerationTime: stats?.avg_generation_time,
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error('Errore API stats:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
