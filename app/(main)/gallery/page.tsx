'use client';

import React from 'react';
import { Heart, Eye, Play, Search } from 'lucide-react';

export default function GalleryPage() {
  return (
    <div className="p-6 lg:p-10">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-500 mb-4">
          Community Showcase
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Explore what's possible with PlasmoAI. Discover, remix, and get inspired by creators worldwide.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-4 z-10 bg-[#090a0f]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <FilterBtn label="Trending" active />
          <FilterBtn label="Newest" />
          <FilterBtn label="Cinematic" />
          <FilterBtn label="Animation" />
          <FilterBtn label="Nature" />
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search prompts..." 
            className="w-full bg-[#161821] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        
        <GalleryCard 
          title="Cyberpunk Rain" 
          author="@neon_dreamer" 
          likes="2.4k" 
          views="12k" 
          aspect="aspect-[9/16]" 
          color="bg-purple-900"
        />
        
        <GalleryCard 
          title="Alpine Lake Drone" 
          author="@nature_lens" 
          likes="1.8k" 
          views="8.5k" 
          aspect="aspect-video" 
          color="bg-emerald-900"
        />

        <GalleryCard 
          title="Abstract Liquid Gold" 
          author="@motion_art" 
          likes="950" 
          views="3k" 
          aspect="aspect-square" 
          color="bg-amber-900"
        />

        <GalleryCard 
          title="Future Car Commercial" 
          author="@ad_agency" 
          likes="3.2k" 
          views="45k" 
          aspect="aspect-video" 
          color="bg-blue-900"
        />

        <GalleryCard 
          title="Pixel Art RPG" 
          author="@retro_dev" 
          likes="800" 
          views="1.2k" 
          aspect="aspect-square" 
          color="bg-indigo-900"
        />

        <GalleryCard 
          title="Cooking B-Roll" 
          author="@chef_visuals" 
          likes="1.5k" 
          views="10k" 
          aspect="aspect-[9/16]" 
          color="bg-orange-900"
        />

      </div>
    </div>
  );
}

function FilterBtn({ label, active }: any) {
  return (
    <button className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
      active 
        ? 'bg-white text-black' 
        : 'bg-[#161821] text-slate-400 hover:text-white hover:bg-slate-800'
    }`}>
      {label}
    </button>
  );
}

function GalleryCard({ title, author, likes, views, aspect, color }: any) {
  return (
    <div className="break-inside-avoid group relative rounded-xl overflow-hidden bg-[#161821] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1">
      {/* Thumbnail Placeholder */}
      <div className={`w-full ${aspect} ${color} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
             <Play className="size-6 text-white fill-white ml-1" />
           </div>
        </div>

        {/* Top Info */}
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-sm text-[10px] font-medium text-white border border-white/10">
            Veo 3.1
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-white mb-1 line-clamp-1">{title}</h3>
        <p className="text-xs text-slate-400 mb-3">{author}</p>
        
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 hover:text-pink-500 transition-colors cursor-pointer">
              <Heart size={14} /> {likes}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> {views}
            </span>
          </div>
          <button className="text-xs font-medium text-blue-400 hover:text-blue-300">
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}
