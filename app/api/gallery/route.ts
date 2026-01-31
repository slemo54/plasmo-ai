import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get query params
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const aspectRatio = searchParams.get('aspectRatio')
    const resolution = searchParams.get('resolution')
    const sortBy = searchParams.get('sortBy') || 'popular'
    const limit = parseInt(searchParams.get('limit') || '24')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    let query = supabase
      .from('video_generations')
      .select(`
        id,
        title,
        prompt,
        thumbnail_url,
        video_url,
        aspect_ratio,
        resolution,
        likes_count,
        views_count,
        created_at,
        profiles: user_id (full_name, avatar_url)
      `)
      .eq('is_public', true)
      .eq('status', 'completed')
      .not('video_url', 'is', null)
      .limit(limit)
      .range(offset, offset + limit - 1)
    
    // Apply filters
    if (aspectRatio) {
      query = query.eq('aspect_ratio', aspectRatio)
    }
    
    if (resolution) {
      query = query.eq('resolution', resolution)
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        query = query.order('created_at', { ascending: false })
        break
      case 'liked':
        query = query.order('likes_count', { ascending: false })
        break
      case 'popular':
      default:
        query = query.order('views_count', { ascending: false })
        break
    }
    
    const { data: videos, error } = await query
    
    if (error) {
      console.error('Errore nel recupero gallery:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero gallery' },
        { status: 500 }
      )
    }
    
    // Transform data to match GalleryVideo interface
    const galleryVideos = videos?.map((video: Record<string, unknown>) => ({
      id: video.id,
      title: video.title,
      prompt: video.prompt,
      thumbnail_url: video.thumbnail_url,
      video_url: video.video_url,
      aspect_ratio: video.aspect_ratio,
      resolution: video.resolution,
      likes_count: video.likes_count,
      views_count: video.views_count,
      created_at: video.created_at,
      user: Array.isArray(video.profiles) ? video.profiles[0] : video.profiles,
    })) || []
    
    return NextResponse.json(galleryVideos)
  } catch (error) {
    console.error('Errore API gallery:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
