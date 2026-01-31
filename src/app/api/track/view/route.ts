import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { hashIP } from '@/lib/utils';
import { sendViewNotification } from '@/lib/email';

// Rate limit: Don't send more than 1 notification per EPK per hour
const NOTIFICATION_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour

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

    // Insert view record
    const { data: viewData, error: viewError } = await supabase
      .from('epk_views')
      .insert({
        epk_id,
        viewer_ip: hashedIP,
        viewer_location: viewerLocation,
        referrer: referrer || null,
        user_agent: userAgent,
        sections_viewed: [],
      })
      .select('id, viewed_at')
      .single();

    if (viewError) {
      console.error('Error tracking view:', viewError);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }

    // Send notification (non-blocking)
    sendNotificationIfEnabled(supabase, epk_id, {
      viewerLocation,
      referrer,
      viewedAt: viewData.viewed_at,
    }).catch(console.error);

    return NextResponse.json({ view_id: viewData.id });
  } catch (error) {
    console.error('Error in view tracking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendNotificationIfEnabled(
  supabase: Awaited<ReturnType<typeof createServiceClient>>,
  epkId: string,
  viewData: { viewerLocation: string | null; referrer: string | null; viewedAt: string }
) {
  // Get EPK with owner info
  const { data: epk, error: epkError } = await supabase
    .from('epks')
    .select('artist_name, slug, notify_on_view, last_notification_at, user_id')
    .eq('id', epkId)
    .single();

  if (epkError || !epk) {
    console.error('Error fetching EPK for notification:', epkError);
    return;
  }

  // Check if notifications are enabled
  if (!epk.notify_on_view) {
    return;
  }

  // Check rate limit
  if (epk.last_notification_at) {
    const lastNotification = new Date(epk.last_notification_at).getTime();
    const now = Date.now();
    if (now - lastNotification < NOTIFICATION_COOLDOWN_MS) {
      console.log('Notification rate limited for EPK:', epkId);
      return;
    }
  }

  // Get owner's email from auth
  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
    epk.user_id
  );

  if (userError || !userData?.user?.email) {
    console.error('Error fetching user email:', userError);
    return;
  }

  // Send notification
  const result = await sendViewNotification(userData.user.email, {
    artistName: epk.artist_name,
    epkSlug: epk.slug,
    viewerLocation: viewData.viewerLocation,
    referrer: viewData.referrer,
    viewedAt: viewData.viewedAt,
  });

  if (result) {
    // Update last_notification_at
    await supabase
      .from('epks')
      .update({ last_notification_at: new Date().toISOString() })
      .eq('id', epkId);
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
