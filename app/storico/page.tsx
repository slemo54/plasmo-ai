'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { VideoGeneration } from '@/types'
import {
  Film,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trash2,
} from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  credits: number
}

export default function StoricoPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [videos, setVideos] = useState<VideoGeneration[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setUser(profile)
      }

      const { data: generations } = await supabase
        .from('video_generations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (generations) {
        setVideos(generations as VideoGeneration[])
      }

      setIsLoading(false)
    }

    loadData()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completato'
      case 'failed':
        return 'Fallito'
      case 'processing':
        return 'In elaborazione'
      default:
        return 'In attesa'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      <Navbar user={{ email: user.email, full_name: user.full_name, credits: user.credits }} onSignOut={handleSignOut} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Indietro
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Storico Video</h1>
            <p className="text-gray-500 text-sm">Tutti i tuoi video generati</p>
          </div>
        </div>

        {/* Videos List */}
        {videos.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Film className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nessun video ancora</h3>
            <p className="text-gray-500 mb-6">
              Inizia creando il tuo primo video cinematografico!
            </p>
            <Link href="/dashboard">
              <Button>Crea il tuo primo video</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className={`w-24 h-16 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    video.aspect_ratio === '9:16' ? 'aspect-[9/16] h-24' : 
                    video.aspect_ratio === '1:1' ? 'aspect-square w-16' : ''
                  }`}>
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Film className="w-6 h-6 text-gray-600" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate mb-1">
                      {video.prompt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(video.status)}
                        {getStatusText(video.status)}
                      </span>
                      <span>{formatDate(video.created_at)}</span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded">
                        {video.resolution}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-800 rounded">
                        {video.aspect_ratio}
                      </span>
                      <span className="text-yellow-500">
                        -{video.credits_used} crediti
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {video.video_url && (
                      <a
                        href={video.video_url}
                        download
                        className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                        title="Scarica"
                      >
                        <Download className="w-4 h-4 text-gray-400" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
