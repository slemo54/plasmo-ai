'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Heart,
  Eye,
  Play,
  Search,
  Film,
  Loader2,
  Download,
  ChevronDown,
  Sparkles,
  Grid3X3,
  List
} from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { GalleryVideo, TemplateCategory } from '@/types';
import Link from 'next/link';

const CATEGORIES: { value: TemplateCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Social Media', label: 'Social' },
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Urban', label: 'Urban' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Abstract', label: 'Abstract' },
];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'liked', label: 'Most Liked' },
];

const ASPECT_RATIOS = [
  { value: '', label: 'All Ratios' },
  { value: '16:9', label: '16:9 Landscape' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: '1:1', label: '1:1 Square' },
];

export default function GalleryPage() {
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createBrowserClient();

  const fetchVideos = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      const currentPage = reset ? 0 : page;

      const url = new URL('/api/gallery', window.location.origin);
      if (selectedCategory !== 'All') {
        url.searchParams.set('category', selectedCategory);
      }
      if (selectedAspectRatio) {
        url.searchParams.set('aspectRatio', selectedAspectRatio);
      }
      url.searchParams.set('sortBy', selectedSort);
      url.searchParams.set('limit', '24');
      url.searchParams.set('offset', String(currentPage * 24));

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error('Failed to load');
      }

      const data = await response.json();

      if (reset) {
        setVideos(data);
        setPage(1);
      } else {
        setVideos(prev => [...prev, ...data]);
        setPage(currentPage + 1);
      }

      setHasMore(data.length === 24);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedSort, selectedAspectRatio, page]);

  useEffect(() => {
    fetchVideos(true);
  }, [selectedCategory, selectedSort, selectedAspectRatio]);

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '9:16': return 'aspect-[9/16]';
      case '1:1': return 'aspect-square';
      default: return 'aspect-video';
    }
  };

  const filteredVideos = videos.filter(v =>
    v.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="max-w-7xl mx-auto mb-10 flex flex-col lg:flex-row gap-4 justify-between items-center sticky top-4 z-10 bg-[#090a0f]/80 backdrop-blur-xl p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.value
                  ? 'bg-white text-black'
                  : 'bg-[#161821] text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161821] border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
            />
          </div>

          <div className="relative">
            <select
              value={selectedAspectRatio}
              onChange={(e) => setSelectedAspectRatio(e.target.value)}
              className="appearance-none bg-[#161821] border border-slate-700 text-slate-300 text-xs rounded-full px-4 py-2 pr-10 focus:outline-none focus:border-blue-500"
            >
              {ASPECT_RATIOS.map((ar) => (
                <option key={ar.value} value={ar.value}>{ar.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="flex bg-[#161821] border border-slate-700 rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-full transition-colors ${
                viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-500'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-full transition-colors ${
                viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-500'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {isLoading && videos.length === 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-video bg-[#161821] rounded-xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="max-w-7xl mx-auto text-center py-20 bg-[#161821] rounded-xl border border-white/5">
          <Film className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-400 mb-2">No videos found</h3>
          <p className="text-sm text-slate-500">Try adjusting your filters or search query</p>
        </div>
      ) : (
        <>
          <div className={`max-w-7xl mx-auto grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group relative rounded-xl overflow-hidden bg-[#161821] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Thumbnail */}
                <div className={`relative ${getAspectRatioClass(video.aspect_ratio)} bg-slate-900 overflow-hidden`}>
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title || 'Video thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-12 h-12 text-slate-800" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play className="size-6 text-white fill-white ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3 text-[10px] text-white/80">
                      <span className="flex items-center gap-1">
                        <Eye size={12} /> {formatViews(video.views_count)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={12} /> {video.likes_count}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/40 backdrop-blur-sm text-[10px] text-white/80 border border-white/10">
                      {video.aspect_ratio}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-white mb-1 line-clamp-1">{video.title || video.prompt}</h3>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
                        {video.user?.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-[10px] text-slate-400">{video.user?.full_name || 'User'}</span>
                    </div>
                    <Link href="/create" onClick={(e) => e.stopPropagation()}>
                      <button className="text-[10px] font-medium text-blue-400 hover:text-blue-300">
                        Use Template
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => fetchVideos()}
                disabled={isLoading}
                className="px-6 py-2 rounded-full bg-[#161821] border border-slate-700 text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-all disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="size-4 animate-spin mx-auto" /> : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-[#111218] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`relative ${getAspectRatioClass(selectedVideo.aspect_ratio)} bg-black`}>
              {selectedVideo.video_url ? (
                <video
                  src={selectedVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Film className="w-16 h-16 text-slate-800" />
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {selectedVideo.title || 'Untitled Video'}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {selectedVideo.prompt}
                  </p>
                </div>
                <div className="flex gap-2">
                   {selectedVideo.video_url && (
                    <a
                      href={selectedVideo.video_url}
                      download
                      className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"
                    >
                      <Download size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                      {selectedVideo.user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-slate-300">
                      {selectedVideo.user?.full_name || 'User'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {formatViews(selectedVideo.views_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {selectedVideo.likes_count}
                    </span>
                  </div>
                </div>

                <Link href="/create" onClick={() => setSelectedVideo(null)}>
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all">
                    Use Prompt
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
