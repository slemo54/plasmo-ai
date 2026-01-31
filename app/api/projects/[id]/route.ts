import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

interface Params {
  params: Promise<{ id: string }>
}

// GET /api/projects/[id] - Get single project
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
    
    if (error || !project) {
      return NextResponse.json(
        { error: 'Progetto non trovato' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Errore API project:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[id] - Update project
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { name, description, thumbnail_url } = body
    
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    
    if (name !== undefined) updates.name = name.trim()
    if (description !== undefined) updates.description = description?.trim()
    if (thumbnail_url !== undefined) updates.thumbnail_url = thumbnail_url
    
    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) {
      console.error('Errore nell aggiornamento progetto:', error)
      return NextResponse.json(
        { error: 'Errore nell aggiornamento progetto' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(project)
  } catch (error) {
    console.error('Errore API project:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete project
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    await supabase
      .from('video_generations')
      .update({ project_id: null })
      .eq('project_id', id)
      .eq('user_id', user.id)
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Errore nella cancellazione progetto:', error)
      return NextResponse.json(
        { error: 'Errore nella cancellazione progetto' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore API project:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
