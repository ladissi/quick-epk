-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth, but we reference it)
-- Note: Supabase Auth creates auth.users automatically

-- EPKs table
CREATE TABLE public.epks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  artist_name TEXT NOT NULL,
  bio TEXT,
  genre TEXT,
  location TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  music_links JSONB DEFAULT '[]'::jsonb,
  video_links JSONB DEFAULT '[]'::jsonb,
  social_links JSONB DEFAULT '[]'::jsonb,
  contact_email TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- EPK Views table
CREATE TABLE public.epk_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  epk_id UUID REFERENCES public.epks(id) ON DELETE CASCADE NOT NULL,
  viewer_ip TEXT,
  viewer_location TEXT,
  referrer TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_on_page INTEGER,
  sections_viewed JSONB DEFAULT '[]'::jsonb
);

-- EPK Clicks table
CREATE TABLE public.epk_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  epk_id UUID REFERENCES public.epks(id) ON DELETE CASCADE NOT NULL,
  view_id UUID REFERENCES public.epk_views(id) ON DELETE SET NULL,
  element_type TEXT NOT NULL,
  element_url TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_epks_user_id ON public.epks(user_id);
CREATE INDEX idx_epks_slug ON public.epks(slug);
CREATE INDEX idx_epks_is_published ON public.epks(is_published);
CREATE INDEX idx_epk_views_epk_id ON public.epk_views(epk_id);
CREATE INDEX idx_epk_views_viewed_at ON public.epk_views(viewed_at);
CREATE INDEX idx_epk_clicks_epk_id ON public.epk_clicks(epk_id);
CREATE INDEX idx_epk_clicks_clicked_at ON public.epk_clicks(clicked_at);

-- Row Level Security (RLS)
ALTER TABLE public.epks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epk_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epk_clicks ENABLE ROW LEVEL SECURITY;

-- EPKs policies
CREATE POLICY "Users can view their own EPKs" ON public.epks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own EPKs" ON public.epks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own EPKs" ON public.epks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own EPKs" ON public.epks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published EPKs" ON public.epks
  FOR SELECT USING (is_published = true);

-- EPK Views policies (analytics are viewable by EPK owner, insertable by anyone)
CREATE POLICY "EPK owners can view their analytics" ON public.epk_views
  FOR SELECT USING (
    epk_id IN (SELECT id FROM public.epks WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert views" ON public.epk_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update views" ON public.epk_views
  FOR UPDATE USING (true);

-- EPK Clicks policies
CREATE POLICY "EPK owners can view their click analytics" ON public.epk_clicks
  FOR SELECT USING (
    epk_id IN (SELECT id FROM public.epks WHERE user_id = auth.uid())
  );

CREATE POLICY "Anyone can insert clicks" ON public.epk_clicks
  FOR INSERT WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_epks_updated_at
  BEFORE UPDATE ON public.epks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('epk-photos', 'epk-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'epk-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'epk-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'epk-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'epk-photos');
