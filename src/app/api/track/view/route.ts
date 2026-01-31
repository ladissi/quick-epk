import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { hashIP } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { epk_id, referrer } = body;

    if (!epk_id) {
      return NextResponse.json({ error: 'Missing epk_id' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    // Get client info
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const hashedIP = hashIP(ip);
    const userAgent = request.headers.get('user-agent') || null;

    // Try to get location from IP (using a free service)
    let viewerLocation = null;
    if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=city,country`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.city && geoData.country) {
            viewerLocation = `${geoData.city}, ${geoData.country}`;
          }
        }
      } catch {
        // Ignore geolocation errors
      }
    }

    const { data, error } = await supabase
      .from('epk_views')
      .insert({
        epk_id,
        viewer_ip: hashedIP,
        viewer_location: viewerLocation,
        referrer: referrer || null,
        user_agent: userAgent,
        sections_viewed: [],
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error tracking view:', error);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }

    return NextResponse.json({ view_id: data.id });
  } catch (error) {
    console.error('Error in view tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { view_id, time_on_page } = body;

    if (!view_id) {
      return NextResponse.json({ error: 'Missing view_id' }, { status: 400 });
    }

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from('epk_views')
      .update({ time_on_page })
      .eq('id', view_id);

    if (error) {
      console.error('Error updating view:', error);
      return NextResponse.json({ error: 'Failed to update view' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
