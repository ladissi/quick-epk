import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function getSpotifyEmbedUrl(url: string): string | null {
  // Handle track, album, artist, playlist URLs
  const regExp = /open\.spotify\.com\/(track|album|artist|playlist)\/([a-zA-Z0-9]+)/;
  const match = url.match(regExp);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}`;
  }
  return null;
}

export function getSoundCloudEmbedUrl(url: string): string {
  // SoundCloud requires oEmbed API, but we can use a simple embed approach
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`;
}

export function hashIP(ip: string): string {
  // Simple hash for privacy - in production, use a proper hashing library
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    spotify: '🎵',
    soundcloud: '☁️',
    apple_music: '🍎',
    bandcamp: '💿',
    youtube: '▶️',
    vimeo: '🎬',
    instagram: '📷',
    twitter: '🐦',
    tiktok: '🎵',
    facebook: '📘',
  };
  return icons[platform] || '🔗';
}
