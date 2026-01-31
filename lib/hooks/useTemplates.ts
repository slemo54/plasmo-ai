'use client'

import { useState, useEffect, useCallback } from 'react'
import { Template, TemplateCategory } from '@/types'

export function useTemplates(category?: TemplateCategory) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const url = new URL('/api/templates', window.location.origin)
      if (category && category !== 'All') {
        url.searchParams.set('category', category)
      }
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento templates')
      }
      
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsLoading(false)
    }
  }, [category])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return {
    templates,
    isLoading,
    error,
    refreshTemplates: fetchTemplates,
  }
}
