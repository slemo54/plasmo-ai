'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Film, 
  Zap, 
  Globe, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Play,
} from '@/components/ui/icons'

interface OnboardingModalProps {
  onComplete: () => void
  isOpen: boolean
}

const STEPS = [
  {
    id: 'welcome',
    title: 'Benvenuto su Plasmo AI',
    description: 'La piattaforma più avanzata per generare video con intelligenza artificiale.',
    icon: Sparkles,
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-600/10',
    features: [
      'Video cinematici in 4K',
      'Più di 10 stili unici',
      'Generazione in pochi minuti',
    ],
  },
  {
    id: 'credits',
    title: 'Sistema Crediti',
    description: 'Ogni generazione costa crediti in base alla qualità scelta.',
    icon: Zap,
    iconColor: 'text-yellow-400',
    iconBg: 'bg-yellow-600/10',
    features: [
      '720p HD = 10 crediti',
      '1080p Full HD = 15 crediti',
      '4K Ultra HD = 20 crediti',
      '8 crediti gratis all\'inizio!',
    ],
  },
  {
    id: 'templates',
    title: 'Template Professionali',
    description: 'Inizia subito con i nostri template ottimizzati per ogni esigenza.',
    icon: Film,
    iconColor: 'text-purple-400',
    iconBg: 'bg-purple-600/10',
    features: [
      'Social Media (TikTok, Reels)',
      'Cinematic & Documentari',
      'Marketing & Prodotti',
      'Gaming & Tech',
    ],
  },
  {
    id: 'community',
    title: 'Galleria Community',
    description: 'Esplora i video creati dalla community e trova ispirazione.',
    icon: Globe,
    iconColor: 'text-green-400',
    iconBg: 'bg-green-600/10',
    features: [
      'Scopri prompt popolari',
      'Condividi i tuoi video',
      'Impara dagli altri creator',
      'Trova nuove idee',
    ],
  },
]

export function OnboardingModal({ onComplete, isOpen }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  if (!isOpen) return null

  const step = STEPS[currentStep]
  const Icon = step.icon
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === STEPS.length - 1

  const handleNext = () => {
    if (isLastStep) {
      onComplete()
    } else {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  const handlePrev = () => {
    if (!isFirstStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(prev => prev - 1)
        setIsAnimating(false)
      }, 200)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#111218] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header with progress */}
        <div className="relative h-2 bg-gray-800">
          <div 
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="p-8">
          <div className={`transition-all duration-200 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* Icon */}
            <div className={`w-16 h-16 ${step.iconBg} rounded-2xl flex items-center justify-center mb-6 mx-auto`}>
              <Icon className={`w-8 h-8 ${step.iconColor}`} />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-3">
              {step.title}
            </h2>

            {/* Description */}
            <p className="text-gray-400 text-center mb-6">
              {step.description}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-8">
              {step.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isFirstStep
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Indietro
            </button>

            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-6 bg-blue-500'
                      : index < currentStep
                      ? 'bg-blue-500/50'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              rightIcon={isLastStep ? undefined : <ChevronRight className="w-4 h-4" />}
            >
              {isLastStep ? 'Inizia' : 'Avanti'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
