'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { EPK, EPKFormData, MusicLink, VideoLink, SocialLink } from '@/types';
import { slugify } from '@/lib/utils';
import PhotoUpload from './PhotoUpload';

interface EPKFormProps {
  initialData?: EPK;
  userId: string;
}

const MUSIC_PLATFORMS = ['spotify', 'soundcloud', 'apple_music', 'bandcamp', 'other'] as const;
const VIDEO_PLATFORMS = ['youtube', 'vimeo', 'other'] as const;
const SOCIAL_PLATFORMS = ['instagram', 'twitter', 'tiktok', 'facebook', 'other'] as const;

export default function EPKForm({ initialData, userId }: EPKFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EPKFormData>({
    artist_name: initialData?.artist_name || '',
    slug: initialData?.slug || '',
    bio: initialData?.bio || '',
    genre: initialData?.genre || '',
    location: initialData?.location || '',
    photos: initialData?.photos || [],
    music_links: initialData?.music_links || [],
    video_links: initialData?.video_links || [],
    social_links: initialData?.social_links || [],
    contact_email: initialData?.contact_email || '',
    is_published: initialData?.is_published || false,
  });

  const updateField = <K extends keyof EPKFormData>(
    field: K,
    value: EPKFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArtistNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    updateField('artist_name', name);
    if (!initialData) {
      updateField('slug', slugify(name));
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('epks')
      .select('id')
      .eq('slug', slug)
      .neq('id', initialData?.id || '')
      .single();

    if (data) {
      setSlugError('This URL is already taken');
    } else {
      setSlugError(null);
    }
  };

  const addMusicLink = () => {
    updateField('music_links', [
      ...formData.music_links,
      { platform: 'spotify', url: '', title: '' },
    ]);
  };

  const updateMusicLink = (index: number, updates: Partial<MusicLink>) => {
    const newLinks = [...formData.music_links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateField('music_links', newLinks);
  };

  const removeMusicLink = (index: number) => {
    updateField(
      'music_links',
      formData.music_links.filter((_, i) => i !== index)
    );
  };

  const addVideoLink = () => {
    updateField('video_links', [
      ...formData.video_links,
      { platform: 'youtube', url: '', title: '' },
    ]);
  };

  const updateVideoLink = (index: number, updates: Partial<VideoLink>) => {
    const newLinks = [...formData.video_links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateField('video_links', newLinks);
  };

  const removeVideoLink = (index: number) => {
    updateField(
      'video_links',
      formData.video_links.filter((_, i) => i !== index)
    );
  };

  const addSocialLink = () => {
    updateField('social_links', [
      ...formData.social_links,
      { platform: 'instagram', url: '', username: '' },
    ]);
  };

  const updateSocialLink = (index: number, updates: Partial<SocialLink>) => {
    const newLinks = [...formData.social_links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateField('social_links', newLinks);
  };

  const removeSocialLink = (index: number) => {
    updateField(
      'social_links',
      formData.social_links.filter((_, i) => i !== index)
    );
  };

  const handlePhotosChange = useCallback((photos: string[]) => {
    updateField('photos', photos);
  }, []);

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();

    if (!formData.artist_name.trim()) {
      setError('Artist name is required');
      return;
    }

    if (!formData.slug.trim()) {
      setError('URL slug is required');
      return;
    }

    if (slugError) {
      setError('Please choose a different URL slug');
      return;
    }

    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const epkData = {
      user_id: userId,
      slug: formData.slug,
      artist_name: formData.artist_name,
      bio: formData.bio || null,
      genre: formData.genre || null,
      location: formData.location || null,
      photos: formData.photos,
      music_links: formData.music_links.filter((l) => l.url),
      video_links: formData.video_links.filter((l) => l.url),
      social_links: formData.social_links.filter((l) => l.url),
      contact_email: formData.contact_email || null,
      is_published: publish,
    };

    let result;

    if (initialData) {
      result = await supabase
        .from('epks')
        .update(epkData)
        .eq('id', initialData.id)
        .select()
        .single();
    } else {
      result = await supabase.from('epks').insert(epkData).select().single();
    }

    if (result.error) {
      setError(result.error.message);
      setIsLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Artist / Band Name"
            value={formData.artist_name}
            onChange={handleArtistNameChange}
            placeholder="Your artist or band name"
            required
          />

          <Input
            label="EPK URL"
            value={formData.slug}
            onChange={(e) => {
              const slug = slugify(e.target.value);
              updateField('slug', slug);
              checkSlugAvailability(slug);
            }}
            placeholder="your-artist-name"
            helperText={`quickepk.com/${formData.slug || 'your-name'}`}
            error={slugError || undefined}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Genre"
              value={formData.genre}
              onChange={(e) => updateField('genre', e.target.value)}
              placeholder="e.g., Indie Rock, Hip Hop, Jazz"
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="e.g., Los Angeles, CA"
            />
          </div>

          <Textarea
            label="Bio"
            value={formData.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Tell your story. What makes your music unique?"
            rows={5}
          />

          <Input
            label="Contact Email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateField('contact_email', e.target.value)}
            placeholder="booking@yourband.com"
            helperText="This will be visible to bookers"
          />
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            photos={formData.photos}
            onChange={handlePhotosChange}
            userId={userId}
            maxPhotos={5}
          />
        </CardContent>
      </Card>

      {/* Music Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Music Links</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addMusicLink}>
            Add Link
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.music_links.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add links to your music on Spotify, SoundCloud, Apple Music, etc.
            </p>
          ) : (
            formData.music_links.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateMusicLink(index, {
                      platform: e.target.value as MusicLink['platform'],
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {MUSIC_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
                <Input
                  value={link.url}
                  onChange={(e) => updateMusicLink(index, { url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMusicLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Video Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Videos</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addVideoLink}>
            Add Video
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.video_links.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add YouTube or Vimeo links to your music videos or performances.
            </p>
          ) : (
            formData.video_links.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateVideoLink(index, {
                      platform: e.target.value as VideoLink['platform'],
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {VIDEO_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <Input
                  value={link.url}
                  onChange={(e) => updateVideoLink(index, { url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVideoLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Media</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addSocialLink}>
            Add Social
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.social_links.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Add your Instagram, Twitter, TikTok, or Facebook profiles.
            </p>
          ) : (
            formData.social_links.map((link, index) => (
              <div key={index} className="flex gap-3 items-start">
                <select
                  value={link.platform}
                  onChange={(e) =>
                    updateSocialLink(index, {
                      platform: e.target.value as SocialLink['platform'],
                    })
                  }
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, { url: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 sticky bottom-4">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => updateField('is_published', e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Published</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Save Changes' : 'Create EPK'}
          </Button>
          {!formData.is_published && (
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              isLoading={isLoading}
            >
              Save & Publish
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
