'use client'

import { useState, useEffect, useCallback } from 'react'
import { Project, CreateProjectInput, UpdateProjectInput } from '@/types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/projects')
      
      if (!response.ok) {
        throw new Error('Errore nel caricamento progetti')
      }
      
      const data = await response.json()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(async (input: CreateProjectInput) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore nella creazione progetto')
      }
      
      const newProject = await response.json()
      setProjects(prev => [newProject, ...prev])
      return newProject
    } catch (err) {
      throw err
    }
  }, [])

  const updateProject = useCallback(async (id: string, input: UpdateProjectInput) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore nell aggiornamento progetto')
      }
      
      const updatedProject = await response.json()
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p))
      return updatedProject
    } catch (err) {
      throw err
    }
  }, [])

  const deleteProject = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Errore nella cancellazione progetto')
      }
      
      setProjects(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      throw err
    }
  }, [])

  return {
    projects,
    isLoading,
    error,
    refreshProjects: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  }
}
