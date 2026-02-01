'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { GalleryVideo, AspectRatio, TemplateCategory } from '@/types'
import { 
  Film, 
  Heart, 
  Eye, 
  Grid3X3, 
  List, 
  Loader2,
  Play,
  Download,
  ChevronDown,
  Sparkles,
} from '@/components/ui/icons'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const CATEGORIES: { value: TemplateCategory | 'All'; label: string }[] = [
  { value: 'All', label: 'Tutti' },
  { value: 'Social Media', label: 'Social' },
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Nature', label: 'Natura' },
  { value: 'Urban', label: 'Urban' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Abstract', label: 'Abstract' },
]

const SORT_OPTIONS = [
  { value: 'popular', label: 'Più popolari' },
  { value: 'recent', label: 'Più recenti' },
  { value: 'liked', label: 'Più votati' },
]

const ASPECT_RATIOS = [
  { value: '', label: 'Tutti formati' },
  { value: '16:9', label: '16:9 Landscape' },
  { value: '9:16', label: '9:16 Portrait' },
  { value: '1:1', label: '1:1 Square' },
]

export default function GalleryPage() {
  const [user, setUser] = useState<{ email: string; full_name?: string; credits: number } | null>(null)
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, full_name, credits')
          .eq('id', session.user.id)
          .single()
        
        if (profile) {
          setUser(profile)
        }
      }
    }
    loadUser()
  }, [supabase])

  const fetchVideos = useCallback(async (reset = false) => {
    try {
      setIsLoading(true)
      const currentPage = reset ? 0 : page
      
      const url = new URL('/api/gallery', window.location.origin)
      if (selectedCategory !== 'All') {
        url.searchParams.set('category', selectedCategory)
      }
      if (selectedAspectRatio) {
        url.searchParams.set('aspectRatio', selectedAspectRatio)
      }
      url.searchParams.set('sortBy', selectedSort)
      url.searchParams.set('limit', '24')
      url.searchParams.set('offset', String(currentPage * 24))

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento')
      }

      const data = await response.json()
      
      if (reset) {
        setVideos(data)
        setPage(1)
      } else {
        setVideos(prev => [...prev, ...data])
        setPage(currentPage + 1)
      }
      
      setHasMore(data.length === 24)
    } catch (error) {
      console.error('Errore:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, selectedSort, selectedAspectRatio, page])

  useEffect(() => {
    fetchVideos(true)
  }, [selectedCategory, selectedSort, selectedAspectRatio])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getAspectRatioClass = (ratio: string) => {
    switch (ratio) {
      case '9:16': return 'aspect-[9/16]'
      case '1:1': return 'aspect-square'
      default: return 'aspect-video'
    }
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      <Navbar 
        user={user} 
        onSignOut={handleSignOut}
      />

      <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Galleria Community</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Scopri i video creati dalla community di Plasmo AI. Trova ispirazione e usa i prompt per creare i tuoi capolavori.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Aspect Ratio Filter */}
            <div className="relative">
              <select
                value={selectedAspectRatio}
                onChange={(e) => setSelectedAspectRatio(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500"
              >
                {ASPECT_RATIOS.map((ar) => (
                  <option key={ar.value} value={ar.value}>{ar.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-500'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {isLoading && videos.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">Nessun video trovato</h3>
            <p className="text-sm text-gray-500">Prova a cambiare i filtri o torna più tardi</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-4 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="group overflow-hidden border-gray-800 hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {/* Thumbnail */}
                  <div className={`relative ${getAspectRatioClass(video.aspect_ratio)} bg-gray-900 overflow-hidden`}>
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title || 'Video thumbnail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-700" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-blue-600/90 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1 text-xs text-white">
                        <Eye className="w-3.5 h-3.5" />
                        {formatViews(video.views_count)}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white">
                        <Heart className="w-3.5 h-3.5" />
                        {video.likes_count}
                      </div>
                    </div>

                    {/* Aspect Ratio Badge */}
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white">
                      {video.aspect_ratio}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-200 line-clamp-2 mb-2">
                      {video.title || video.prompt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-[10px] text-white font-bold">
                          {video.user?.full_name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-xs text-gray-500">
                          {video.user?.full_name || 'Utente'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-600">
                        {new Date(video.created_at).toLocaleDateString('it-IT')}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="secondary"
                  onClick={() => fetchVideos()}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Caricamento...' : 'Carica altri'}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="bg-[#111218] border border-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video Player */}
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
                  <Film className="w-16 h-16 text-gray-700" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {selectedVideo.title || 'Video senza titolo'}
              </h3>
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                {selectedVideo.prompt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-xs text-white font-bold">
                      {selectedVideo.user?.full_name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-gray-300">
                      {selectedVideo.user?.full_name || 'Utente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViews(selectedVideo.views_count)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {selectedVideo.likes_count}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {selectedVideo.video_url && (
                    <a
                      href={selectedVideo.video_url}
                      download
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-300 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Scarica
                    </a>
                  )}
                  <Link href="/dashboard">
                    <Button
                      onClick={() => {
                        // Copy prompt to clipboard
                        navigator.clipboard.writeText(selectedVideo.prompt)
                      }}
                    >
                      Usa Prompt
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
