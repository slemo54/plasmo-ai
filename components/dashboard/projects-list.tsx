'use client'

import React, { useState } from 'react'
import { Project } from '@/types'
import { useProjects } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Folder, Plus, Film, MoreVertical, Trash2, Edit2 } from '@/components/ui/icons'

interface ProjectsListProps {
  selectedProjectId: string | null
  onSelectProject: (projectId: string | null) => void
}

export function ProjectsList({ selectedProjectId, onSelectProject }: ProjectsListProps) {
  const { projects, isLoading, createProject, deleteProject } = useProjects()
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null)

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    
    try {
      setIsCreating(false)
      await createProject({ name: newProjectName.trim() })
      setNewProjectName('')
    } catch (err) {
      console.error('Errore creazione progetto:', err)
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      if (selectedProjectId === id) {
        onSelectProject(null)
      }
      setShowMenuFor(null)
    } catch (err) {
      console.error('Errore cancellazione progetto:', err)
    }
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-600/10 rounded-lg">
            <Folder className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-sm font-semibold text-gray-200">Progetti</h3>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Create Project Input */}
      {isCreating && (
        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nome progetto..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateProject()
              if (e.key === 'Escape') {
                setIsCreating(false)
                setNewProjectName('')
              }
            }}
            autoFocus
          />
          <Button size="sm" onClick={handleCreateProject}>
            Crea
          </Button>
        </div>
      )}

      {/* Projects List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* All Videos Option */}
          <button
            onClick={() => onSelectProject(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
              selectedProjectId === null
                ? 'bg-blue-600/10 border border-blue-500/30'
                : 'hover:bg-gray-800 border border-transparent'
            }`}
          >
            <Film className={`w-4 h-4 ${selectedProjectId === null ? 'text-blue-400' : 'text-gray-500'}`} />
            <span className={`text-xs font-medium ${selectedProjectId === null ? 'text-blue-400' : 'text-gray-300'}`}>
              Tutti i video
            </span>
          </button>

          {/* Projects */}
          {projects.map((project) => (
            <div
              key={project.id}
              className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                selectedProjectId === project.id
                  ? 'bg-blue-600/10 border border-blue-500/30'
                  : 'hover:bg-gray-800 border border-transparent'
              }`}
            >
              <button
                onClick={() => onSelectProject(project.id)}
                className="flex-1 flex items-center gap-3 min-w-0"
              >
                <Folder className={`w-4 h-4 flex-shrink-0 ${
                  selectedProjectId === project.id ? 'text-blue-400' : 'text-gray-500'
                }`} />
                <div className="flex-1 min-w-0 text-left">
                  <p className={`text-xs font-medium truncate ${
                    selectedProjectId === project.id ? 'text-blue-400' : 'text-gray-300'
                  }`}>
                    {project.name}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {project.video_count} video
                  </p>
                </div>
              </button>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenuFor(showMenuFor === project.id ? null : project.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded transition-all"
                >
                  <MoreVertical className="w-3 h-3 text-gray-400" />
                </button>

                {showMenuFor === project.id && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenuFor(null)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-32 bg-[#1a1b23] border border-gray-700 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Elimina
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {projects.length === 0 && !isCreating && (
            <p className="text-xs text-gray-500 text-center py-4">
              Nessun progetto. Crea il primo!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
