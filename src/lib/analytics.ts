import { createClient } from '@/lib/supabase/client';

let viewId: string | null = null;
let startTime: number | null = null;

export function getViewId(): string | null {
  return viewId;
}

export function setViewId(id: string): void {
  viewId = id;
}

export async function trackView(epkId: string): Promise<string | null> {
  try {
    const response = await fetch('/api/track/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        epk_id: epkId,
        referrer: document.referrer || null,
      }),
    });

    if (!response.ok) {
      console.error('Failed to track view');
      return null;
    }

    const data = await response.json();
    viewId = data.view_id;
    startTime = Date.now();
    return viewId;
  } catch (error) {
    console.error('Error tracking view:', error);
    return null;
  }
}

export async function trackClick(
  epkId: string,
  elementType: 'music' | 'video' | 'social' | 'contact',
  elementUrl: string
): Promise<void> {
  try {
    await fetch('/api/track/click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        epk_id: epkId,
        view_id: viewId,
        element_type: elementType,
        element_url: elementUrl,
      }),
    });
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

export function trackTimeOnPage(epkId: string): void {
  if (!viewId || !startTime) return;

  const timeOnPage = Math.round((Date.now() - startTime) / 1000);

  // Use sendBeacon for reliability on page unload
  const data = JSON.stringify({
    view_id: viewId,
    epk_id: epkId,
    time_on_page: timeOnPage,
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/track/view', data);
  } else {
    // Fallback for older browsers
    fetch('/api/track/view', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
      keepalive: true,
    });
  }
}

export function trackSectionViewed(epkId: string, section: string): void {
  if (!viewId) return;

  const supabase = createClient();

  // Update sections_viewed array
  supabase
    .from('epk_views')
    .select('sections_viewed')
    .eq('id', viewId)
    .single()
    .then(({ data }) => {
      if (data) {
        const sections = data.sections_viewed || [];
        if (!sections.includes(section)) {
          sections.push(section);
          supabase
            .from('epk_views')
            .update({ sections_viewed: sections })
            .eq('id', viewId)
            .then(() => {});
        }
      }
    });
}

export function setupPageUnloadTracking(epkId: string): () => void {
  const handler = () => trackTimeOnPage(epkId);

  window.addEventListener('beforeunload', handler);
  window.addEventListener('pagehide', handler);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handler();
    }
  });

  return () => {
    window.removeEventListener('beforeunload', handler);
    window.removeEventListener('pagehide', handler);
  };
}
