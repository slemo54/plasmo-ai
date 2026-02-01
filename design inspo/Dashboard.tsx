import React from 'react';
import { 
  BarChart3, 
  Video, 
  Zap, 
  Clock, 
  Plus, 
  ArrowUpRight, 
  MoreVertical,
  Play,
  Film
} from 'lucide-react';

export default function DashboardDesign() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 font-sans selection:bg-blue-500/30">
      {/* Sidebar Navigation (Mock) */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-800/60 bg-[#111218]/50 backdrop-blur-xl p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10">
          <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Play className="size-5 text-white fill-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            PlasmoAI
          </span>
        </div>

        <nav className="space-y-2">
          <NavItem icon={<BarChart3 />} label="Dashboard" active />
          <NavItem icon={<Video />} label="My Projects" />
          <NavItem icon={<Film />} label="Templates" />
          <NavItem icon={<Zap />} label="Generation" />
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-900/10 border border-blue-500/20">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-blue-400">Pro Plan</span>
              <span className="text-xs text-slate-400">85/100 credits</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-blue-500 rounded-full" />
            </div>
            <button className="mt-3 w-full py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors">
              Upgrade Plan
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 lg:p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome back, Creator</h1>
            <p className="text-slate-400 text-sm">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40">
              <Plus className="size-4" />
              <span>New Video</span>
            </button>
            <div className="size-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
               {/* User Avatar Placeholder */}
               <img src="/api/placeholder/40/40" alt="User" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard 
            title="Total Videos" 
            value="24" 
            trend="+12%" 
            icon={<Video className="text-blue-400" />} 
          />
          <StatCard 
            title="Credits Used" 
            value="1,240" 
            trend="+5%" 
            icon={<Zap className="text-yellow-400" />} 
          />
          <StatCard 
            title="Avg. Gen Time" 
            value="1m 42s" 
            trend="-8%" 
            trendUp={false}
            icon={<Clock className="text-emerald-400" />} 
          />
        </div>

        {/* Recent Projects Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Generations</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Project Card 1 */}
            <ProjectCard 
              title="Cyberpunk City Flyover" 
              time="2 mins ago" 
              status="ready"
              thumbnail="bg-gradient-to-br from-purple-900 to-slate-900"
            />
            {/* Project Card 2 */}
            <ProjectCard 
              title="Product Showcase v2" 
              time="1 hour ago" 
              status="processing"
              thumbnail="bg-slate-800"
            />
             {/* Project Card 3 */}
             <ProjectCard 
              title="Nature Documentary Intro" 
              time="5 hours ago" 
              status="ready"
              thumbnail="bg-gradient-to-br from-emerald-900 to-slate-900"
            />
             {/* Project Card 4 */}
             <ProjectCard 
              title="Tech Conference Teaser" 
              time="1 day ago" 
              status="ready"
              thumbnail="bg-gradient-to-br from-blue-900 to-slate-900"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

// Components

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active 
        ? 'bg-blue-600/10 text-blue-400' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      {label}
    </button>
  );
}

function StatCard({ title, value, trend, trendUp = true, icon }: any) {
  return (
    <div className="p-6 rounded-xl bg-[#161821] border border-slate-800/60 hover:border-slate-700 transition-colors group">
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

function ProjectCard({ title, time, status, thumbnail }: any) {
  return (
    <div className="group rounded-xl overflow-hidden bg-[#161821] border border-slate-800/60 hover:border-slate-700 transition-all hover:translate-y-[-2px]">
      <div className={`aspect-video w-full relative ${thumbnail} flex items-center justify-center`}>
        {status === 'processing' ? (
           <div className="flex flex-col items-center gap-2">
             <div className="size-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
             <span className="text-xs text-blue-400 font-medium">Rendering...</span>
           </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
            <button className="size-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors">
              <Play className="size-5 text-white fill-white ml-0.5" />
            </button>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
             status === 'processing' 
               ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
               : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
           }`}>
             {status}
           </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{title}</h4>
            <p className="text-xs text-slate-500 mt-1">{time}</p>
          </div>
          <button className="text-slate-500 hover:text-slate-300">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
