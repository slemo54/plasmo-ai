import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (unreadOnly) {
      query = query.eq('is_read', false)
    }
    
    const { data: notifications, error } = await query
    
    if (error) {
      console.error('Errore nel recupero notifiche:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero notifiche' },
        { status: 500 }
      )
    }
    
    // Get unread count
    const { count: unreadCount, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: unreadCount || 0,
    })
  } catch (error) {
    console.error('Errore API notifications:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Create notification (internal use)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { type, title, message, data: notificationData } = body
    
    if (!type || !title) {
      return NextResponse.json(
        { error: 'Tipo e titolo sono obbligatori' },
        { status: 400 }
      )
    }
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        type,
        title,
        message,
        data: notificationData,
        is_read: false,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Errore nella creazione notifica:', error)
      return NextResponse.json(
        { error: 'Errore nella creazione notifica' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(notification)
  } catch (error) {
    console.error('Errore API notifications:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}

// PATCH /api/notifications - Mark all as read
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      )
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false)
    
    if (error) {
      console.error('Errore nell aggiornamento notifiche:', error)
      return NextResponse.json(
        { error: 'Errore nell aggiornamento notifiche' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore API notifications:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
