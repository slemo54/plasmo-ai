import React from 'react';
import { Search, Play, Star } from 'lucide-react';

export default function TemplatesDesign() {
  const categories = ['All', 'Social Media', 'Business', 'Creative', 'Education', 'Marketing'];

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 font-sans p-6 lg:p-10">
      
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
            className="w-full bg-[#161821] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                i === 0 
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <TemplateCard 
          title="Product Launch Promo" 
          category="Business" 
          duration="15s"
          color="bg-blue-900"
        />

        <TemplateCard 
          title="Cinematic Travel Vlog" 
          category="Creative" 
          duration="30s"
          color="bg-emerald-900"
        />

        <TemplateCard 
          title="Instagram Story Ad" 
          category="Social Media" 
          duration="10s"
          format="9:16"
          color="bg-purple-900"
        />

         <TemplateCard 
          title="Tech Explainer" 
          category="Education" 
          duration="60s"
          color="bg-slate-800"
        />

        <TemplateCard 
          title="Cyberpunk Intro" 
          category="Creative" 
          duration="8s"
          color="bg-fuchsia-900"
        />

        <TemplateCard 
          title="Corporate Annual Report" 
          category="Business" 
          duration="45s"
          color="bg-indigo-900"
        />

      </div>
    </div>
  );
}

function TemplateCard({ title, category, duration, color, format = "16:9" }: any) {
  return (
    <div className="group bg-[#161821] rounded-xl overflow-hidden border border-slate-800/60 hover:border-blue-500/50 transition-all hover:-translate-y-1">
      {/* Thumbnail */}
      <div className={`aspect-video w-full ${color} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
        
        {/* Hover Action */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm transform hover:scale-105 transition-transform">
            Use Template
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-medium text-white border border-white/10">
            {format}
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
      </div>
    </div>
  );
}
