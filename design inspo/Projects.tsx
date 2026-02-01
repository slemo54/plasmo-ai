import React from 'react';
import { 
  Folder, 
  MoreVertical, 
  Search, 
  Plus, 
  Grid, 
  List, 
  Calendar, 
  Film,
  ArrowUpDown
} from 'lucide-react';

export default function ProjectsDesign() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 font-sans p-6 lg:p-10">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
             <span className="hover:text-slate-300 cursor-pointer">Home</span>
             <span>/</span>
             <span className="text-slate-200 font-medium">Projects</span>
           </nav>
           <h1 className="text-2xl font-bold text-white">My Projects</h1>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20">
          <Plus size={18} />
          Create New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto mb-8 bg-[#161821] p-2 rounded-xl border border-slate-800/60 flex flex-col md:flex-row gap-4 justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="w-full bg-[#0f1014] border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-2 bg-[#0f1014] border border-slate-800 rounded-lg text-sm text-slate-400">
             <ArrowUpDown size={14} />
             <span>Sort by: Date</span>
           </div>

           <div className="flex bg-[#0f1014] border border-slate-800 rounded-lg p-1">
             <button className="p-1.5 rounded bg-slate-800 text-white shadow-sm">
               <Grid size={16} />
             </button>
             <button className="p-1.5 rounded text-slate-500 hover:text-slate-300">
               <List size={16} />
             </button>
           </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Project Card */}
        <ProjectFolder 
          name="Summer Marketing Campaign" 
          count="12 Videos" 
          date="Updated 2h ago"
          color="blue"
        />

        <ProjectFolder 
          name="Product Launch v2" 
          count="5 Videos" 
          date="Updated yesterday"
          color="purple"
        />

        <ProjectFolder 
          name="Social Media Reels" 
          count="24 Videos" 
          date="Updated 3 days ago"
          color="emerald"
        />

        <ProjectFolder 
          name="Client: TechCorp" 
          count="8 Videos" 
          date="Updated 1 week ago"
          color="amber"
        />

        <ProjectFolder 
          name="Internal Training" 
          count="3 Videos" 
          date="Updated 2 weeks ago"
          color="slate"
        />

      </div>
    </div>
  );
}

function ProjectFolder({ name, count, date, color }: any) {
  const gradients: any = {
    blue: "from-blue-600/20 to-blue-900/10 border-blue-500/20",
    purple: "from-purple-600/20 to-purple-900/10 border-purple-500/20",
    emerald: "from-emerald-600/20 to-emerald-900/10 border-emerald-500/20",
    amber: "from-amber-600/20 to-amber-900/10 border-amber-500/20",
    slate: "from-slate-600/20 to-slate-900/10 border-slate-500/20",
  };

  const iconColors: any = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    slate: "text-slate-400",
  };

  return (
    <div className={`group p-5 rounded-xl bg-gradient-to-br ${gradients[color]} border hover:border-white/10 transition-all hover:-translate-y-1 cursor-pointer`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-3 rounded-lg bg-[#0f1014]/50 backdrop-blur-sm ${iconColors[color]}`}>
          <Folder size={24} />
        </div>
        <button className="text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
          <MoreVertical size={18} />
        </button>
      </div>
      
      <div>
        <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{name}</h3>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Film size={12} /> {count}
          </span>
          <span className="flex items-center gap-1">
             <Calendar size={12} /> {date}
          </span>
        </div>
      </div>
    </div>
  );
}
