'use client';

import React, { useState } from 'react';
import { 
  Folder, 
  MoreVertical, 
  Search, 
  Plus, 
  Grid, 
  List, 
  Calendar, 
  Film,
  ArrowUpDown,
  Loader2,
  Video
} from 'lucide-react';
import Link from 'next/link';
import { useProjects } from '@/lib/hooks';
import { formatDistanceToNow } from '@/lib/utils';

export default function ProjectsPage() {
  const { projects, isLoading, createProject, deleteProject } = useProjects();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      await createProject({ name: newProjectName });
      setNewProjectName('');
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="p-6 lg:p-10 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
             <Link href="/" className="hover:text-slate-300 cursor-pointer">Home</Link>
             <span>/</span>
             <span className="text-slate-200 font-medium">Projects</span>
           </nav>
           <h1 className="text-2xl font-bold text-white">My Projects</h1>
        </div>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:scale-105"
        >
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f1014] border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>

        {/* Filters & View Toggle */}
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-2 bg-[#0f1014] border border-slate-800 rounded-lg text-sm text-slate-400">
             <ArrowUpDown size={14} />
             <span>Sort by: Date</span>
           </div>

           <div className="flex bg-[#0f1014] border border-slate-800 rounded-lg p-1">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <Grid size={16} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
             >
               <List size={16} />
             </button>
           </div>
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="size-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20 bg-[#161821] rounded-xl border border-slate-800">
          <Folder className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No projects yet</h3>
          <p className="text-slate-400 mb-4">Create your first project to organize your videos</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>
      ) : (
        <div className={`max-w-7xl mx-auto grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProjects.map((project, index) => (
            <ProjectFolder 
              key={project.id}
              name={project.name} 
              count={`${project.video_count} Videos`} 
              date={formatDistanceToNow(project.updated_at)}
              color={['blue', 'purple', 'emerald', 'amber', 'slate'][index % 5]}
              onDelete={() => deleteProject(project.id)}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#161821] border border-slate-800 rounded-xl p-6 w-full max-w-md animate-scale-in">
            <h2 className="text-xl font-bold text-white mb-4">Create New Project</h2>
            <input
              type="text"
              placeholder="Project name..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              className="w-full bg-[#0f1014] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectFolder({ name, count, date, color, onDelete }: any) {
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
    <div className={`group p-5 rounded-xl bg-gradient-to-br ${gradients[color]} border hover:border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-3 rounded-lg bg-[#0f1014]/50 backdrop-blur-sm ${iconColors[color]}`}>
          <Folder size={24} />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
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
