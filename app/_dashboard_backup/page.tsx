'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'
import { Navbar } from '@/components/navbar'
import { PromptForm } from '@/components/studio/prompt-form'
import { VideoResult } from '@/components/studio/video-result'
import { GenerateVideoParams, AppState, AspectRatio, Template } from '@/types'
import { Zap, Film, TrendingUp, Clock, CreditCard, BarChart3 } from '@/components/ui/icons'
import { 
  StatsCard, 
  TemplatesGallery, 
  ProjectsList, 
  PromptEnhancer,
  NotificationCenter 
} from '@/components/dashboard'
import { OnboardingModal } from '@/components/onboarding-modal'
import { useStats } from '@/lib/hooks'

interface UserProfile {
  id: string
  email: string
  full_name?: string
  credits: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [appState, setAppState] = useState<AppState>(AppState.IDLE)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [lastConfig, setLastConfig] = useState<GenerateVideoParams | null>(null)
  const [lastAspectRatio, setLastAspectRatio] = useState<AspectRatio>(AspectRatio.LANDSCAPE)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)

  const router = useRouter()
  const supabase = createBrowserClient()
  const { stats, isLoading: statsLoading, refreshStats } = useStats()

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
        // Check if first time user (less than 1 hour since creation)
        const createdAt = new Date(profile.created_at)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        if (createdAt > oneHourAgo) {
          setShowOnboarding(true)
        }
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
        body: JSON.stringify({
          ...params,
          projectId: selectedProjectId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la generazione')
      }

      setVideoUrl(data.videoUrl)
      setAppState(AppState.SUCCESS)

      // Update credits and stats
      setUser(prev => prev ? { ...prev, credits: data.remainingCredits } : null)
      refreshStats()
    } catch (error: any) {
      console.error('Errore:', error)
      setErrorMessage(error.message || 'Errore durante la generazione del video')
      setAppState(AppState.ERROR)
    } finally {
      setIsLoading(false)
    }
  }, [user, selectedProjectId, refreshStats])

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

  const handleSelectTemplate = (template: Template) => {
    // Could open a modal or pre-fill the form
    // For now, we'll just show a toast or console log
    console.log('Selected template:', template)
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
      <Navbar 
        user={{ email: user.email, full_name: user.full_name, credits: user.credits }} 
        onSignOut={handleSignOut}
        rightElement={<NotificationCenter />}
      />

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
      />

      {/* Promo Badge */}
      <div className="w-full flex justify-center py-3 px-4">
        <div className="px-4 py-1.5 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-600/30 rounded-full text-[10px] font-bold text-yellow-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse" />
          8 crediti gratis al primo accesso
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 sm:px-6 pb-12">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatsCard
            title="Crediti"
            value={user.credits}
            subtitle="Disponibili"
            icon={Zap}
            iconColor="text-blue-400"
            iconBgColor="bg-blue-600/20"
          />
          <StatsCard
            title="Video Creati"
            value={statsLoading ? '-' : stats?.totalVideos || 0}
            subtitle={statsLoading ? '' : `+${stats?.thisWeekVideos || 0} questa settimana`}
            icon={Film}
            iconColor="text-purple-400"
            iconBgColor="bg-purple-600/20"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Crediti Usati"
            value={statsLoading ? '-' : stats?.totalCreditsSpent || 0}
            subtitle={statsLoading ? '' : `${stats?.thisMonthCredits || 0} questo mese`}
            icon={CreditCard}
            iconColor="text-amber-400"
            iconBgColor="bg-amber-600/20"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Tempo Medio"
            value={statsLoading ? '-' : stats?.avgGenerationTime ? `${stats.avgGenerationTime}s` : 'N/A'}
            subtitle="Per generazione"
            icon={Clock}
            iconColor="text-green-400"
            iconBgColor="bg-green-600/20"
            isLoading={statsLoading}
          />
          <StatsCard
            title="Efficienza"
            value="95%"
            subtitle="Successo generazioni"
            icon={TrendingUp}
            iconColor="text-emerald-400"
            iconBgColor="bg-emerald-600/20"
          />
          <StatsCard
            title="Attività"
            value={statsLoading ? '-' : stats?.thisWeekVideos || 0}
            subtitle="Video questa settimana"
            icon={BarChart3}
            iconColor="text-cyan-400"
            iconBgColor="bg-cyan-600/20"
            isLoading={statsLoading}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Sidebar - Projects & Templates */}
          {showSidebar && (
            <div className="xl:col-span-3 space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
              <ProjectsList
                selectedProjectId={selectedProjectId}
                onSelectProject={setSelectedProjectId}
              />
              <TemplatesGallery onSelectTemplate={handleSelectTemplate} />
            </div>
          )}

          {/* Center - Studio */}
          <div className={`${showSidebar ? 'xl:col-span-9' : 'xl:col-span-12'} grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch min-h-[600px]`}>
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
        </div>
      </main>
    </div>
  )
}
