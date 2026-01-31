'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
  Provider,
} from '@/types'
import {
  ArrowRight,
  Plus,
  Monitor,
  Smartphone,
  Square,
  SlidersHorizontal,
  X,
  Sparkles,
} from '@/components/ui/icons'
import { TextArea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      if (base64) resolve(base64)
      else reject(new Error('Failed to read file'))
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const fileToImageFile = async (file: File): Promise<ImageFile> => ({
  file,
  base64: await fileToBase64(file),
})

interface ImageUploadProps {
  onSelect: (image: ImageFile) => void
  onRemove?: () => void
  image?: ImageFile | null
  label: string
  className?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onSelect,
  onRemove,
  image,
  label,
  className = 'w-24 h-16',
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const imageFile = await fileToImageFile(file)
        onSelect(imageFile)
      } catch (error) {
        console.error('Errore:', error)
      }
    }
    if (inputRef.current) inputRef.current.value = ''
  }

  if (image) {
    return (
      <div className={`relative group ${className}`}>
        <img
          src={URL.createObjectURL(image.file)}
          alt="preview"
          className="w-full h-full object-cover rounded-lg border border-gray-600"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`${className} bg-gray-800/50 hover:bg-gray-700 border border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gray-300 transition-colors`}
    >
      <Plus className="w-5 h-5" />
      <span className="text-[10px] mt-1 font-medium">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </button>
  )
}

interface PromptFormProps {
  onGenerate: (params: GenerateVideoParams) => void
  initialValues?: GenerateVideoParams | null
  isLoading?: boolean
}

export const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  initialValues,
  isLoading = false,
}) => {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '')
  const [provider, setProvider] = useState<Provider>(initialValues?.provider ?? Provider.AI_314)
  const [model, setModel] = useState<VeoModel>(initialValues?.model ?? VeoModel.VEO_FAST)
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(initialValues?.aspectRatio ?? AspectRatio.LANDSCAPE)
  const [resolution, setResolution] = useState<Resolution>(initialValues?.resolution ?? Resolution.P720)
  const [generationMode, setGenerationMode] = useState<GenerationMode>(initialValues?.mode ?? GenerationMode.TEXT_TO_VIDEO)
  const [startFrame, setStartFrame] = useState<ImageFile | null>(initialValues?.startFrame ?? null)
  const [endFrame, setEndFrame] = useState<ImageFile | null>(initialValues?.endFrame ?? null)
  const [referenceImages, setReferenceImages] = useState<ImageFile[]>(initialValues?.referenceImages ?? [])
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onGenerate({
      prompt,
      model,
      aspectRatio,
      resolution,
      mode: generationMode,
      provider,
      startFrame,
      endFrame,
      referenceImages,
    })
  }, [prompt, model, aspectRatio, resolution, generationMode, provider, startFrame, endFrame, referenceImages, onGenerate])

  const isSubmitDisabled = !prompt.trim() && generationMode === GenerationMode.TEXT_TO_VIDEO && !startFrame

  const getCostDisplay = () => {
    if (resolution === Resolution.P4K) return 20
    if (resolution === Resolution.P1080) return 15
    return 10
  }

  return (
    <div className="bg-[#111218] border border-gray-800 rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600/10 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-100">Crea Video</h2>
        </div>
        <span className="text-xs px-3 py-1 bg-gray-800 text-gray-400 rounded-full">
          Studio AI
        </span>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex-grow overflow-y-auto space-y-6">
        <p className="text-sm text-gray-400">
          Descrivi il video che vuoi creare o carica immagini di riferimento per guidare la generazione AI.
        </p>

        {/* PROVIDER */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
            Provider AI
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(Provider).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setProvider(p)}
                className={`relative py-2.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                  provider === p
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                    : 'bg-gray-800/40 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {p === Provider.AI_314 ? 'Plasmo 3.14 AI' : 'Veo Google'}
                {p === Provider.AI_314 && (
                  <span className="absolute -top-1.5 -right-1 bg-yellow-600 text-[8px] text-white px-1.5 py-0.5 rounded-full border border-black">
                    Consigliato
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MODEL / MODE */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
            Modalità
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: GenerationMode.TEXT_TO_VIDEO, label: 'Testo → Video' },
              { value: GenerationMode.FRAMES_TO_VIDEO, label: 'Fotogrammi' },
              { value: GenerationMode.REFERENCES_TO_VIDEO, label: 'Riferimenti' },
            ].map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setGenerationMode(m.value as GenerationMode)}
                className={`py-2.5 px-1 text-[11px] font-semibold rounded-lg border transition-all ${
                  generationMode === m.value
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-gray-800/40 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* ASPECT RATIO */}
        <div>
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
            Proporzioni
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: AspectRatio.LANDSCAPE, icon: Monitor, label: '16:9' },
              { value: AspectRatio.PORTRAIT, icon: Smartphone, label: '9:16' },
              { value: AspectRatio.SQUARE, icon: Square, label: '1:1' },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setAspectRatio(value)}
                className={`flex flex-col items-center py-2 px-2 text-[11px] font-semibold rounded-lg border transition-all ${
                  aspectRatio === value
                    ? 'bg-blue-600/10 border-blue-500 text-blue-400'
                    : 'bg-gray-800/40 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* CONDITIONAL MEDIA UPLOADS */}
        {generationMode === GenerationMode.FRAMES_TO_VIDEO && (
          <div className="flex gap-4 p-4 bg-gray-900/30 rounded-xl border border-gray-800">
            <ImageUpload
              label="Frame Iniziale"
              image={startFrame}
              onSelect={setStartFrame}
              onRemove={() => setStartFrame(null)}
            />
            <ImageUpload
              label="Frame Finale"
              image={endFrame}
              onSelect={setEndFrame}
              onRemove={() => setEndFrame(null)}
            />
          </div>
        )}

        {generationMode === GenerationMode.REFERENCES_TO_VIDEO && (
          <div className="flex flex-wrap gap-2 p-4 bg-gray-900/30 rounded-xl border border-gray-800">
            {referenceImages.map((img, i) => (
              <ImageUpload
                key={i}
                label=""
                image={img}
                onSelect={() => {}}
                onRemove={() => setReferenceImages((imgs) => imgs.filter((_, idx) => idx !== i))}
                className="w-16 h-16"
              />
            ))}
            {referenceImages.length < 3 && (
              <ImageUpload
                label="Aggiungi"
                onSelect={(img) => setReferenceImages([...referenceImages, img])}
                className="w-16 h-16"
              />
            )}
          </div>
        )}

        {/* TEXT PROMPT */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Prompt
            </label>
            {prompt && (
              <button
                type="button"
                onClick={() => setPrompt('')}
                className="text-[10px] text-gray-400 hover:text-white transition-colors"
              >
                Cancella
              </button>
            )}
          </div>
          <div className="relative group">
            <TextArea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descrivi il video che vuoi creare... ad esempio: Un drone che vola sopra una foresta nebbiosa all'alba, con raggi di sole che filtrano tra gli alberi..."
              rows={4}
              className="min-h-[120px] bg-[#161821]"
            />
            <div className="absolute bottom-3 right-3">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SETTINGS */}
        {isSettingsOpen && (
          <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                Risoluzione
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                className="w-full bg-[#161821] border border-gray-700 rounded-lg p-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value={Resolution.P720}>720p (HD)</option>
                <option value={Resolution.P1080}>1080p (Full HD)</option>
                <option value={Resolution.P4K}>4K (Ultra HD)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">
                Modello
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as VeoModel)}
                className="w-full bg-[#161821] border border-gray-700 rounded-lg p-2.5 text-xs text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value={VeoModel.VEO_FAST}>Veo Fast (Più veloce)</option>
                <option value={VeoModel.VEO}>Veo Standard (Migliore qualità)</option>
              </select>
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitDisabled || isLoading}
            isLoading={isLoading}
            size="lg"
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Genera Video
          </Button>
          <p className="text-[10px] text-gray-600 text-center mt-3 uppercase tracking-tight">
            Costo: {getCostDisplay()} crediti
          </p>
        </div>
      </form>
    </div>
  )
}
