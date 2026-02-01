'use client';

import React, { useState } from 'react';
import { Search, Play, Loader2, Sparkles } from 'lucide-react';
import { useTemplates } from '@/lib/hooks';
import Link from 'next/link';

const CATEGORIES = ['All', 'Social Media', 'Business', 'Creative', 'Education', 'Marketing'];

export default function TemplatesPage() {
  const { templates, isLoading } = useTemplates();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((t: any) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 lg:p-10 animate-fade-in">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Templates Library</h1>
        <p className="text-slate-400">Jumpstart your creation with professional, pre-configured styles.</p>
      </div>

      {/* Toolbar */}
      <div className="max-w-7xl mx-auto mb-10 space-y-6">
        {/* Search */}
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search templates (e.g., 'Product Launch', 'Instagram Story')..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161821] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30' 
                  : 'bg-[#161821] text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="max-w-7xl mx-auto flex items-center justify-center py-20">
          <Loader2 className="size-8 text-blue-500 animate-spin" />
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20 bg-[#161821] rounded-xl border border-slate-800">
          <Sparkles className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No templates found</h3>
          <p className="text-slate-400">Try a different search or category</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template: any) => (
            <TemplateCard 
              key={template.id}
              title={template.name}
              category={template.category}
              description={template.description}
              duration="15s"
              color={getCategoryColor(template.category)}
              prompt={template.prompt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryColor(category: string): string {
  const colors: any = {
    'Social Media': 'bg-purple-900',
    'Business': 'bg-blue-900',
    'Creative': 'bg-emerald-900',
    'Education': 'bg-slate-800',
    'Marketing': 'bg-amber-900',
    'Cinematic': 'bg-indigo-900',
    'Nature': 'bg-green-900',
    'Urban': 'bg-cyan-900',
    'Gaming': 'bg-pink-900',
    'Abstract': 'bg-fuchsia-900',
  };
  return colors[category] || 'bg-slate-800';
}

function TemplateCard({ title, category, description, duration, color, prompt }: any) {
  return (
    <div className="group bg-[#161821] rounded-xl overflow-hidden border border-slate-800/60 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail */}
      <div className={`aspect-video w-full ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link 
            href={`/create?prompt=${encodeURIComponent(prompt)}`}
            className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm transform hover:scale-105 transition-transform"
          >
            Use Template
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white border border-white/10">
            16:9
          </span>
        </div>
         <div className="absolute bottom-2 right-2">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white flex items-center gap-1">
            <Play size={8} fill="currentColor" /> {duration}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-xs text-slate-500">{category}</p>
        {description && (
          <p className="text-xs text-slate-600 mt-2 line-clamp-2">{description}</p>
        )}
      </div>
    </div>
  );
}
