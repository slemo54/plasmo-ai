import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const apiKey = process.env.GOOGLE_AI_API_KEY

if (!apiKey) {
  throw new Error('GOOGLE_AI_API_KEY non configurata')
}

const ai = new GoogleGenAI({ apiKey })

const STYLE_PROMPTS: Record<string, string> = {
  cinematic: `Enhance this video prompt for cinematic quality. Add details about:
- Professional camera movement (dolly, crane, handheld, etc.)
- Lighting (golden hour, dramatic shadows, soft fill, etc.)
- Color grading (teal and orange, high contrast, muted tones, etc.)
- Film characteristics (35mm grain, anamorphic lenses, depth of field)
- Aspect ratio composition
- Mood and atmosphere`,
  
  commercial: `Enhance this video prompt for commercial/advertising quality. Add details about:
- Product lighting (studio setup, soft boxes, rim lighting)
- Clean backgrounds or contextual environments
- Smooth camera movements (gimbal, slider)
- Professional color correction
- Sharp focus and clarity
- Brand-appropriate aesthetics`,
  
  artistic: `Enhance this video prompt for artistic expression. Add details about:
- Unique visual style (surreal, abstract, impressionist)
- Creative camera angles and movements
- Experimental lighting and colors
- Artistic composition rules
- Emotional impact and symbolism
- Texture and visual complexity`,
  
  vlog: `Enhance this video prompt for vlog/content creator style. Add details about:
- Natural or ring lighting
- Engaging camera angles (eye level, dynamic)
- Authentic, relatable atmosphere
- Modern editing style
- Social media optimized composition
- Personality and energy`,
}

const INTENSITY_MULTIPLIERS: Record<string, number> = {
  subtle: 0.5,
  moderate: 1,
  extreme: 1.5,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, style = 'cinematic', intensity = 'moderate' } = body
    
    if (!prompt || prompt.trim() === '') {
      return NextResponse.json(
        { error: 'Il prompt è obbligatorio' },
        { status: 400 }
      )
    }
    
    const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.cinematic
    const intensityMultiplier = INTENSITY_MULTIPLIERS[intensity] || 1
    
    const enhancementInstruction = `${stylePrompt}

Original prompt: "${prompt}"

Provide an enhanced version that maintains the original intent but adds professional video production details.
Intensity level: ${intensity} (multiply descriptive detail by ${intensityMultiplier})

Respond ONLY with a JSON object in this exact format:
{
  "enhancedPrompt": "the enhanced video prompt here",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "tags": ["tag1", "tag2", "tag3"]
}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: enhancementInstruction,
    })
    
    const text = response.text
    
    if (!text) {
      throw new Error('Risposta vuota da Gemini')
    }
    
    // Extract JSON from response
    let jsonMatch = text.match(/\{[\s\S]*\}/)
    let result
    
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0])
      } catch {
        // Fallback: create structured response
        result = {
          enhancedPrompt: text.replace(/```json?\n?|```/g, '').trim(),
          suggestions: ['Prova diverse angolazioni', 'Aggiungi dettagli di luce', 'Sperimenta con il ritmo'],
          tags: [style, 'enhanced', 'ai-generated'],
        }
      }
    } else {
      result = {
        enhancedPrompt: text.replace(/```json?\n?|```/g, '').trim(),
        suggestions: ['Prova diverse angolazioni', 'Aggiungi dettagli di luce', 'Sperimenta con il ritmo'],
        tags: [style, 'enhanced', 'ai-generated'],
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Errore enhancement prompt:', error)
    return NextResponse.json(
      { error: 'Errore nel miglioramento del prompt' },
      { status: 500 }
    )
  }
}
