'use client';

import React from 'react';
import { 
  Video, 
  Zap, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  MoreVertical,
  Play,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useDashboard } from '@/lib/hooks';
import { formatDistanceToNow } from '@/lib/utils';

export default function DashboardPage() {
  const { stats, loading } = useDashboard();

  return (
    <div className="p-6 lg:p-10 animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Creator</h1>
          <p className="text-slate-400 text-sm">Here's what's happening with your projects today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/create" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105">
            <Plus className="size-4" />
            <span>New Video</span>
          </Link>
          <div className="size-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
             <img src="/api/placeholder/40/40" alt="User" className="w-full h-full object-cover opacity-80" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Videos" 
          value={loading ? '...' : stats.totalVideos.toString()} 
          trend="+12%" 
          icon={<Video className="text-blue-400" />} 
        />
        <StatCard 
          title="Credits Used" 
          value={loading ? '...' : stats.creditsUsed.toLocaleString()} 
          trend="+5%" 
          icon={<Zap className="text-yellow-400" />} 
        />
        <StatCard 
          title="Avg. Gen Time" 
          value={loading ? '...' : stats.avgGenTime} 
          trend="-8%" 
          trendUp={false}
          icon={<Clock className="text-emerald-400" />} 
        />
      </div>

      {/* Recent Projects Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Generations</h2>
          <Link href="/projects" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 text-blue-500 animate-spin" />
          </div>
        ) : stats.recentVideos.length === 0 ? (
          <div className="text-center py-20 bg-[#161821] rounded-xl border border-slate-800">
            <Video className="size-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
            <p className="text-slate-400 mb-4">Create your first AI-generated video</p>
            <Link href="/create" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors">
              <Plus className="size-4" />
              Create Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.recentVideos.map((video: any) => (
              <ProjectCard 
                key={video.id}
                title={video.prompt.slice(0, 50) + '...'} 
                time={formatDistanceToNow(video.created_at)}
                status={video.status}
                thumbnail={video.thumbnail_url}
                videoUrl={video.video_url}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// Components

function StatCard({ title, value, trend, trendUp = true, icon }: any) {
  return (
    <div className="p-6 rounded-xl bg-[#161821] border border-slate-800/60 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-slate-400'}`}>
          {trend}
          <ArrowUpRight size={14} />
        </div>
      </div>
      <div>
        <p className="text-slate-400 text-sm mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}

function ProjectCard({ title, time, status, thumbnail, videoUrl }: any) {
  const isProcessing = status === 'processing' || status === 'pending';
  
  return (
    <div className="group rounded-xl overflow-hidden bg-[#161821] border border-slate-800/60 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-video w-full relative bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : null}
        
        {isProcessing ? (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
             <div className="size-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-2" />
             <span className="text-xs text-blue-400 font-medium">Rendering...</span>
           </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <a 
              href={videoUrl || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="size-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all hover:scale-110"
            >
              <Play className="size-5 text-white fill-white ml-0.5" />
            </a>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
             isProcessing
               ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
               : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
           }`}>
             {isProcessing ? 'processing' : 'ready'}
           </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">{time}</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300 ml-2">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
