import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { epk_id, view_id, element_type, element_url } = body;

    if (!epk_id || !element_type || !element_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['music', 'video', 'social', 'contact'];
    if (!validTypes.includes(element_type)) {
      return NextResponse.json(
        { error: 'Invalid element_type' },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    const { error } = await supabase.from('epk_clicks').insert({
      epk_id,
      view_id: view_id || null,
      element_type,
      element_url,
    });

    if (error) {
      console.error('Error tracking click:', error);
      return NextResponse.json(
        { error: 'Failed to track click' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in click tracking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
