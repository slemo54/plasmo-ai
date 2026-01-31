import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET /api/projects - List all user projects
export async function GET(request: NextRequest) {
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
    
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Errore nel recupero progetti:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero progetti' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(projects)
  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
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
    const { name, description } = body
    
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Il nome del progetto è obbligatorio' },
        { status: 400 }
      )
    }
    
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: name.trim(),
        description: description?.trim(),
        video_count: 0,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Errore nella creazione progetto:', error)
      return NextResponse.json(
        { error: 'Errore nella creazione progetto' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Errore API projects:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
