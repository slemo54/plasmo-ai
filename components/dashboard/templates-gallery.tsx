'use client'

import React, { useState } from 'react'
import { Template, TemplateCategory, GenerateVideoParams } from '@/types'
import { useTemplates } from '@/lib/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2, Play } from '@/components/ui/icons'

const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: 'All', label: 'Tutti' },
  { value: 'Social Media', label: 'Social' },
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Nature', label: 'Natura' },
  { value: 'Urban', label: 'Urban' },
  { value: 'Gaming', label: 'Gaming' },
]

interface TemplatesGalleryProps {
  onSelectTemplate: (template: Template) => void
}

export function TemplatesGallery({ onSelectTemplate }: TemplatesGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('All')
  const { templates, isLoading } = useTemplates(selectedCategory)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-purple-600/10 rounded-lg">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-200">Template Popolari</h3>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
              selectedCategory === cat.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-6 text-gray-500 text-sm">
          Nessun template disponibile
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {templates.slice(0, 4).map((template) => (
            <Card
              key={template.id}
              className="group relative overflow-hidden cursor-pointer border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1"
              onClick={() => onSelectTemplate(template)}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative">
                <img
                  src={template.thumbnail_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Play overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                  <p className="text-xs font-semibold text-white truncate">
                    {template.name}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {template.category}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
