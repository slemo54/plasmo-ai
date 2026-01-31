'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Wand2, Loader2, Sparkles, X, Check } from '@/components/ui/icons'

interface PromptEnhancerProps {
  prompt: string
  onEnhanced: (enhancedPrompt: string) => void
}

const STYLES = [
  { value: 'cinematic', label: 'Cinematic', desc: 'Look da film professionale' },
  { value: 'commercial', label: 'Commercial', desc: 'Stile pubblicitario' },
  { value: 'artistic', label: 'Artistic', desc: 'Espressione artistica' },
  { value: 'vlog', label: 'Vlog', desc: 'Stile creator/content' },
]

const INTENSITIES = [
  { value: 'subtle', label: 'Leggero', desc: 'Miglioramenti minimi' },
  { value: 'moderate', label: 'Medio', desc: 'Bilanciato' },
  { value: 'extreme', label: 'Estremo', desc: 'Massimo dettaglio' },
]

export function PromptEnhancer({ prompt, onEnhanced }: PromptEnhancerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [style, setStyle] = useState('cinematic')
  const [intensity, setIntensity] = useState('moderate')
  const [result, setResult] = useState<{ enhancedPrompt: string; suggestions: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    if (!prompt.trim()) return
    
    setIsEnhancing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, intensity }),
      })
      
      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Errore enhancement')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleApply = () => {
    if (result?.enhancedPrompt) {
      onEnhanced(result.enhancedPrompt)
      setIsOpen(false)
      setResult(null)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        disabled={!prompt.trim()}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-purple-400 bg-purple-600/10 border border-purple-500/20 rounded-lg hover:bg-purple-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 className="w-3.5 h-3.5" />
        Migliora con AI
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111218] border border-gray-800 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-600/10 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Migliora Prompt</h3>
          </div>
          <button
            onClick={() => {
              setIsOpen(false)
              setResult(null)
              setError(null)
            }}
            className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Style Selection */}
          {!result && (
            <>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Stile
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`p-2.5 rounded-lg border text-left transition-all ${
                        style === s.value
                          ? 'bg-purple-600/10 border-purple-500/50'
                          : 'bg-gray-800/40 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        style === s.value ? 'text-purple-400' : 'text-gray-300'
                      }`}>
                        {s.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {s.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Selection */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                  Intensità
                </label>
                <div className="flex gap-2">
                  {INTENSITIES.map((i) => (
                    <button
                      key={i.value}
                      onClick={() => setIntensity(i.value)}
                      className={`flex-1 p-2 rounded-lg border text-center transition-all ${
                        intensity === i.value
                          ? 'bg-purple-600/10 border-purple-500/50'
                          : 'bg-gray-800/40 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <p className={`text-xs font-medium ${
                        intensity === i.value ? 'text-purple-400' : 'text-gray-300'
                      }`}>
                        {i.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2 block">
                  Prompt Migliorato
                </label>
                <div className="p-3 bg-green-600/5 border border-green-500/20 rounded-lg">
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {result.enhancedPrompt}
                  </p>
                </div>
              </div>

              {result.suggestions.length > 0 && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                    Suggerimenti
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {result.suggestions.map((suggestion, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-800 text-gray-400 text-[10px] rounded-full"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-600/10 border border-red-500/20 rounded-lg">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {result ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setResult(null)}
                  className="flex-1"
                >
                  Indietro
                </Button>
                <Button
                  onClick={handleApply}
                  className="flex-1"
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Applica
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEnhance}
                isLoading={isEnhancing}
                disabled={isEnhancing}
                className="w-full"
                leftIcon={isEnhancing ? undefined : <Wand2 className="w-4 h-4" />}
              >
                {isEnhancing ? 'Miglioramento...' : 'Migliora Prompt'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
