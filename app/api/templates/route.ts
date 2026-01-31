import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET /api/templates - List all templates
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    let query = supabase
      .from('templates')
      .select('*')
      .eq('is_active', true)
      .order('popularity', { ascending: false })
      .limit(limit)
    
    if (category && category !== 'All') {
      query = query.eq('category', category)
    }
    
    const { data: templates, error } = await query
    
    if (error) {
      console.error('Errore nel recupero templates:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero templates' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Errore API templates:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create new template (admin only in production)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { name, category, description, thumbnail_url, prompt, default_resolution, default_aspect_ratio } = body
    
    if (!name || !category || !prompt) {
      return NextResponse.json(
        { error: 'Nome, categoria e prompt sono obbligatori' },
        { status: 400 }
      )
    }
    
    const { data: template, error } = await supabase
      .from('templates')
      .insert({
        name,
        category,
        description,
        thumbnail_url,
        prompt,
        default_resolution,
        default_aspect_ratio,
        is_active: true,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Errore nella creazione template:', error)
      return NextResponse.json(
        { error: 'Errore nella creazione template' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(template)
  } catch (error) {
    console.error('Errore API templates:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
