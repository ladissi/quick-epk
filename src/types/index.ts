export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface EPK {
  id: string;
  user_id: string;
  slug: string;
  artist_name: string;
  bio: string | null;
  genre: string | null;
  location: string | null;
  photos: string[];
  music_links: MusicLink[];
  video_links: VideoLink[];
  social_links: SocialLink[];
  contact_email: string | null;
  is_published: boolean;
  notify_on_view: boolean;
  last_notification_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MusicLink {
  platform: 'spotify' | 'soundcloud' | 'apple_music' | 'bandcamp' | 'other';
  url: string;
  title?: string;
}

export interface VideoLink {
  platform: 'youtube' | 'vimeo' | 'other';
  url: string;
  title?: string;
}

export interface SocialLink {
  platform: 'instagram' | 'twitter' | 'tiktok' | 'facebook' | 'other';
  url: string;
  username?: string;
}

export interface EPKView {
  id: string;
  epk_id: string;
  viewer_ip: string;
  viewer_location: string | null;
  referrer: string | null;
  user_agent: string | null;
  viewed_at: string;
  time_on_page: number | null;
  sections_viewed: string[];
}

export interface EPKClick {
  id: string;
  epk_id: string;
  view_id: string | null;
  element_type: 'music' | 'video' | 'social' | 'contact';
  element_url: string;
  clicked_at: string;
}

export interface EPKFormData {
  artist_name: string;
  slug: string;
  bio: string;
  genre: string;
  location: string;
  photos: string[];
  music_links: MusicLink[];
  video_links: VideoLink[];
  social_links: SocialLink[];
  contact_email: string;
  is_published: boolean;
  notify_on_view: boolean;
}

export interface AnalyticsOverview {
  total_views: number;
  unique_views: number;
  total_clicks: number;
  views_by_date: { date: string; count: number }[];
  clicks_by_type: { type: string; count: number }[];
  top_referrers: { referrer: string; count: number }[];
  recent_views: EPKView[];
}
