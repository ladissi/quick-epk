import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import EPKPublicView from '@/components/epk/EPKPublicView';

interface PublicEPKPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicEPKPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: epk } = await supabase
    .from('epks')
    .select('artist_name, bio, genre, photos')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!epk) {
    return {
      title: 'EPK Not Found | QuickEPK',
    };
  }

  const description = epk.bio
    ? epk.bio.substring(0, 160)
    : `${epk.artist_name} - ${epk.genre || 'Artist'} electronic press kit`;

  return {
    title: `${epk.artist_name} | QuickEPK`,
    description,
    openGraph: {
      title: epk.artist_name,
      description,
      images: epk.photos?.[0] ? [epk.photos[0]] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: epk.artist_name,
      description,
      images: epk.photos?.[0] ? [epk.photos[0]] : [],
    },
  };
}

export default async function PublicEPKPage({ params }: PublicEPKPageProps) {
  const { slug } = await params;

  // Skip reserved routes
  const reservedSlugs = ['dashboard', 'login', 'signup', 'api', 'auth'];
  if (reservedSlugs.includes(slug)) {
    notFound();
  }

  const supabase = await createClient();

  const { data: epk } = await supabase
    .from('epks')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!epk) {
    notFound();
  }

  return <EPKPublicView epk={epk} />;
}
