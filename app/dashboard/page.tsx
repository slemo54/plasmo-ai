'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { PromptForm } from '@/components/studio/prompt-form'
import { VideoResult } from '@/components/studio/video-result'
import { GenerateVideoParams, AppState, AspectRatio } from '@/types'
import { Sparkles, Zap, Film, AlertCircle } from '@/components/ui/icons'
import { Card, CardHeader } from '@/components/ui/card'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  credits: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [appState, setAppState] = useState<AppState>(AppState.IDLE)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastConfig, setLastConfig] = useState<GenerateVideoParams | null>(null)
  const [lastAspectRatio, setLastAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const supabase = createBrowserClient()

  useEffect(() => {
    const checkUser = async () => {
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
    }

    checkUser()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    if (!user) return

    const cost = params.resolution === '4k' ? 20 : params.resolution === '1080p' ? 15 : 10

    if (user.credits < cost) {
      setErrorMessage('Crediti insufficienti. Ricarica il tuo account per continuare.')
      setAppState(AppState.ERROR)
      return
    }

    setIsLoading(true)
    setAppState(AppState.LOADING)
    setErrorMessage(null)
    setLastConfig(params)
    setLastAspectRatio(params.aspectRatio)

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la generazione')
      }

      setVideoUrl(data.videoUrl)
      setAppState(AppState.SUCCESS)

      // Aggiorna crediti
      setUser(prev => prev ? { ...prev, credits: data.remainingCredits } : null)
    } catch (error: any) {
      console.error('Errore:', error)
      setErrorMessage(error.message || 'Errore durante la generazione del video')
      setAppState(AppState.ERROR)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const handleNewVideo = () => {
    setAppState(AppState.IDLE)
    setVideoUrl(null)
    setErrorMessage(null)
    setLastConfig(null)
  }

  const handleRetry = () => {
    if (lastConfig) {
      handleGenerate(lastConfig)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#090a0f] flex flex-col">
      <Navbar user={{ email: user.email, full_name: user.full_name, credits: user.credits }} onSignOut={handleSignOut} />

      {/* Promo Badge */}
      <div className="w-full flex justify-center py-4 px-4">
        <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-600/30 rounded-full text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
          8 crediti gratis al primo accesso
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Crediti</p>
                <p className="text-xl font-bold">{user.credits}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Film className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Video Creati</p>
                <p className="text-xl font-bold">-</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Studio */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch min-h-[600px]">
          <PromptForm
            onGenerate={handleGenerate}
            initialValues={null}
            isLoading={isLoading}
          />
          
          <VideoResult
            videoUrl={videoUrl || undefined}
            status={appState}
            errorMessage={errorMessage || undefined}
            aspectRatio={lastAspectRatio}
            onRetry={handleRetry}
            onNewVideo={handleNewVideo}
          />
        </div>
      </main>
    </div>
  )
}
