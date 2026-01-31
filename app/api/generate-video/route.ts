import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, VideoGenerationReferenceType } from '@google/genai'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { GenerateVideoParams, AspectRatio, Resolution } from '@/types'

const CREDIT_COSTS: Record<Resolution, number> = {
  [Resolution.P720]: 1,
  [Resolution.P1080]: 2,
  [Resolution.P4K]: 4,
}

export async function POST(request: NextRequest) {
  try {
    // Verifica autenticazione (await cookies() for Next.js 15 compatibility)
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore } as any)
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Recupera profilo utente
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json(
        { error: 'Profilo non trovato' },
        { status: 404 }
      )
    }

    // Parse request body
    const params: GenerateVideoParams = await request.json()
    const cost = CREDIT_COSTS[params.resolution]

    // Verifica crediti sufficienti
    if (profile.credits < cost) {
      return NextResponse.json(
        { error: 'Crediti insufficienti' },
        { status: 403 }
      )
    }

    // Crea record iniziale
    const { data: generation, error: generationError } = await supabase
      .from('video_generations')
      .insert({
        user_id: userId,
        prompt: params.prompt,
        status: 'processing',
        aspect_ratio: params.aspectRatio,
        resolution: params.resolution,
        mode: params.mode,
        credits_used: cost,
      })
      .select()
      .single()

    if (generationError) {
      console.error('Errore creazione generazione:', generationError)
      return NextResponse.json(
        { error: 'Errore nel database' },
        { status: 500 }
      )
    }

    // Inizia generazione video con Google AI
    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      await supabase
        .from('video_generations')
        .update({ status: 'failed', error_message: 'API key non configurata' })
        .eq('id', generation.id)

      return NextResponse.json(
        { error: 'Servizio non configurato' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    // Mappa aspect ratio per Veo
    let requestedAspectRatio = params.aspectRatio === AspectRatio.SQUARE ? '9:16' : params.aspectRatio

    const config: any = {
      numberOfVideos: 1,
      resolution: params.resolution,
    }

    if (params.mode !== 'extend_video') {
      config.aspectRatio = requestedAspectRatio
    }

    const generateVideoPayload: any = {
      model: params.model,
      config: config,
    }

    if (params.prompt) {
      generateVideoPayload.prompt = params.prompt
    }

    // Gestione modalità con immagini
    if (params.mode === 'frames_to_video') {
      if (params.startFrame) {
        generateVideoPayload.image = {
          imageBytes: params.startFrame.base64,
          mimeType: params.startFrame.file.type,
        }
      }
      if (params.endFrame) {
        generateVideoPayload.config.lastFrame = {
          imageBytes: params.endFrame.base64,
          mimeType: params.endFrame.file.type,
        }
      }
    } else if (params.mode === 'references_to_video' && params.referenceImages?.length) {
      const referenceImagesPayload = params.referenceImages.map((img) => ({
        image: { imageBytes: img.base64, mimeType: img.file.type },
        referenceType: VideoGenerationReferenceType.ASSET,
      }))
      generateVideoPayload.config.referenceImages = referenceImagesPayload
    }

    console.log('Generazione video con payload:', { ...generateVideoPayload, image: undefined })

    // Avvia generazione
    let operation = await ai.models.generateVideos(generateVideoPayload)

    // Polling per risultato
    const maxAttempts = 60 // 8 minuti max
    let attempts = 0

    while (!operation.done && attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 8000))
      operation = await ai.operations.getVideosOperation({ operation: operation })
      attempts++
    }

    if (!operation.done) {
      await supabase
        .from('video_generations')
        .update({ status: 'failed', error_message: 'Timeout generazione' })
        .eq('id', generation.id)

      return NextResponse.json(
        { error: 'Timeout durante la generazione' },
        { status: 504 }
      )
    }

    // Estrai video URL
    if (operation?.response?.generatedVideos?.[0]?.video) {
      const videoObject = operation.response.generatedVideos[0].video
      const videoUri = decodeURIComponent(videoObject?.uri || '')
      
      // Scarica video
      const videoResponse = await fetch(`${videoUri}&key=${apiKey}`)
      if (!videoResponse.ok) {
        throw new Error(`Fetch video fallito: ${videoResponse.status}`)
      }

      const videoBlob = await videoResponse.blob()
      
      // Upload a Supabase Storage (opzionale, per persistenza)
      const fileName = `videos/${userId}/${generation.id}.mp4`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoBlob, {
          contentType: 'video/mp4',
          upsert: true,
        })

      let videoUrl = ''
      if (uploadError) {
        console.error('Errore upload:', uploadError)
        // Fallback all'URL di Google diretto
        videoUrl = videoUri
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName)
        videoUrl = publicUrl
      }

      // Aggiorna database con video completato
      await supabase
        .from('video_generations')
        .update({
          status: 'completed',
          video_url: videoUrl,
        })
        .eq('id', generation.id)

      // Detrai crediti
      const newCredits = profile.credits - cost
      await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', userId)

      // Registra transazione
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: -cost,
        type: 'usage',
        description: `Generazione video ${params.resolution}`,
      })

      return NextResponse.json({
        success: true,
        videoUrl,
        remainingCredits: newCredits,
      })
    } else {
      throw new Error('Nessun video generato')
    }

  } catch (error: any) {
    console.error('Errore generazione:', error)
    return NextResponse.json(
      { error: error.message || 'Errore interno del server' },
      { status: 500 }
    )
  }
}
