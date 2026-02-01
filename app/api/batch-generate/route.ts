import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// POST /api/batch-generate - Generate multiple video variations
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { basePrompt, variations, config } = body;

    if (!basePrompt || !variations || variations.length === 0) {
      return NextResponse.json(
        { error: 'Prompt e variations sono richiesti' },
        { status: 400 }
      );
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();

    const costPerVideo = config.resolution === '4k' ? 20 : config.resolution === '1080p' ? 15 : 10;
    const totalCost = costPerVideo * variations.length;

    if (!profile || profile.credits < totalCost) {
      return NextResponse.json(
        { error: 'Crediti insufficienti' },
        { status: 403 }
      );
    }

    // Create batch generation records
    const generations = await Promise.all(
      variations.map(async (variation: string) => {
        const enhancedPrompt = `${basePrompt}. ${variation}`;
        
        const { data: generation } = await supabase
          .from('video_generations')
          .insert({
            user_id: user.id,
            prompt: enhancedPrompt,
            status: 'pending',
            aspect_ratio: config.aspectRatio,
            resolution: config.resolution,
            mode: config.mode || 'text_to_video',
            credits_used: costPerVideo,
          })
          .select()
          .single();

        return generation;
      })
    );

    // Deduct credits
    await supabase
      .from('profiles')
      .update({ credits: profile.credits - totalCost })
      .eq('id', user.id);

    return NextResponse.json({ 
      success: true, 
      generations,
      totalCost,
      remainingCredits: profile.credits - totalCost
    });
  } catch (error) {
    console.error('Batch generation error:', error);
    return NextResponse.json(
      { error: 'Errore durante la generazione batch' },
      { status: 500 }
    );
  }
}
