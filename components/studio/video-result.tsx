'use client'

import React from 'react'
import { AspectRatio } from '@/types'
import { Download, AlertCircle, CheckCircle, Loader2, Film } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

interface VideoResultProps {
  videoUrl?: string
  status: 'idle' | 'loading' | 'success' | 'error'
  errorMessage?: string
  aspectRatio: AspectRatio
  onRetry?: () => void
  onNewVideo?: () => void
}

export const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  status,
  errorMessage,
  aspectRatio,
  onRetry,
  onNewVideo,
}) => {
  const isPortrait = aspectRatio === AspectRatio.PORTRAIT
  const isSquare = aspectRatio === AspectRatio.SQUARE

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center group">
            <div className="w-20 h-20 border-2 border-dashed border-gray-800 rounded-full flex items-center justify-center mb-6 group-hover:border-blue-500/50 transition-colors">
              <Film className="w-8 h-8 text-gray-600 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">Pronto a creare?</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Compila il form e premi genera per vedere i risultati cinematografici apparire qui.
            </p>
          </div>
        )

      case 'loading':
        return (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-300 mt-6 mb-2">Generazione in corso...</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Stiamo creando il tuo video con l'AI. Questo processo può richiedere alcuni minuti.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Elaborazione attiva
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-red-900/20 border border-red-500/30 rounded-full flex items-center justify-center mb-6">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Qualcosa è andato storto</h3>
            <p className="text-sm text-gray-500 max-w-xs mb-8">{errorMessage || 'Errore durante la generazione del video'}</p>
            <div className="flex gap-3">
              {onRetry && (
                <Button variant="secondary" onClick={onRetry}>
                  Riprova
                </Button>
              )}
              {onNewVideo && (
                <Button variant="outline" onClick={onNewVideo}>
                  Nuovo Video
                </Button>
              )}
            </div>
          </div>
        )

      case 'success':
        if (!videoUrl) return null
        return (
          <div className="space-y-6">
            <div
              className={`w-full relative rounded-xl overflow-hidden bg-black border border-gray-800 shadow-2xl transition-all ${
                isPortrait
                  ? 'aspect-[9/16] max-w-[300px] mx-auto'
                  : isSquare
                  ? 'aspect-square max-w-[400px] mx-auto'
                  : 'aspect-video'
              }`}
            >
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-3">
              <a
                href={videoUrl}
                download="plasmo-video.mp4"
                className="flex-1"
              >
                <Button variant="secondary" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                  Scarica
                </Button>
              </a>
              {onNewVideo && (
                <Button variant="outline" onClick={onNewVideo}>
                  Nuovo
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-green-900/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-400">Video generato con successo!</span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-[#111218] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-800 rounded-lg">
            <Film className="w-5 h-5 text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-100">Risultato</h2>
        </div>
        {status === 'success' && (
          <span className="text-xs px-2 py-1 bg-green-600/10 text-green-400 rounded-full border border-green-600/20">
            Completato
          </span>
        )}
      </div>

      <div className="p-5 flex-grow overflow-y-auto">{renderContent()}</div>
    </div>
  )
}
