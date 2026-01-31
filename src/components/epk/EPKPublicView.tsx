'use client';

import { useEffect } from 'react';
import { EPK } from '@/types';
import {
  trackView,
  trackClick,
  setupPageUnloadTracking,
} from '@/lib/analytics';
import {
  getYouTubeVideoId,
  getVimeoVideoId,
  getSpotifyEmbedUrl,
  getSoundCloudEmbedUrl,
} from '@/lib/utils';

interface EPKPublicViewProps {
  epk: EPK;
}

export default function EPKPublicView({ epk }: EPKPublicViewProps) {
  useEffect(() => {
    trackView(epk.id);
    const cleanup = setupPageUnloadTracking(epk.id);
    return cleanup;
  }, [epk.id]);

  const handleLinkClick = (
    type: 'music' | 'video' | 'social' | 'contact',
    url: string
  ) => {
    trackClick(epk.id, type, url);
  };

  const getPlatformDisplayName = (platform: string): string => {
    const names: Record<string, string> = {
      spotify: 'Spotify',
      soundcloud: 'SoundCloud',
      apple_music: 'Apple Music',
      bandcamp: 'Bandcamp',
      youtube: 'YouTube',
      vimeo: 'Vimeo',
      instagram: 'Instagram',
      twitter: 'Twitter',
      tiktok: 'TikTok',
      facebook: 'Facebook',
    };
    return names[platform] || platform;
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Hero Section */}
      <div className="relative">
        {epk.photos && epk.photos.length > 0 ? (
          <div className="h-[50vh] md:h-[60vh] relative">
            <img
              src={epk.photos[0]}
              alt={epk.artist_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          </div>
        ) : (
          <div className="h-[30vh] bg-gradient-to-br from-purple-600 to-purple-900" />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              {epk.artist_name}
            </h1>
            <div className="flex flex-wrap gap-3 text-gray-300">
              {epk.genre && (
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {epk.genre}
                </span>
              )}
              {epk.location && (
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {epk.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Bio */}
        {epk.bio && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {epk.bio}
            </p>
          </section>
        )}

        {/* Music */}
        {epk.music_links && epk.music_links.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Music</h2>
            <div className="space-y-4">
              {epk.music_links.map((link, index) => {
                const spotifyEmbed = link.platform === 'spotify' ? getSpotifyEmbedUrl(link.url) : null;
                const soundcloudEmbed = link.platform === 'soundcloud' ? getSoundCloudEmbedUrl(link.url) : null;

                if (spotifyEmbed) {
                  return (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <iframe
                        src={spotifyEmbed}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                      />
                    </div>
                  );
                }

                if (soundcloudEmbed) {
                  return (
                    <div key={index} className="rounded-xl overflow-hidden">
                      <iframe
                        width="100%"
                        height="166"
                        scrolling="no"
                        frameBorder="no"
                        allow="autoplay"
                        src={soundcloudEmbed}
                        className="rounded-xl"
                      />
                    </div>
                  );
                }

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick('music', link.url)}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {getPlatformDisplayName(link.platform)}
                      </p>
                      <p className="text-gray-400 text-sm">Listen now</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Videos */}
        {epk.video_links && epk.video_links.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
            <div className="grid gap-6">
              {epk.video_links.map((link, index) => {
                const youtubeId = getYouTubeVideoId(link.url);
                const vimeoId = getVimeoVideoId(link.url);

                if (youtubeId) {
                  return (
                    <div
                      key={index}
                      className="aspect-video rounded-xl overflow-hidden"
                      onClick={() => handleLinkClick('video', link.url)}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      />
                    </div>
                  );
                }

                if (vimeoId) {
                  return (
                    <div
                      key={index}
                      className="aspect-video rounded-xl overflow-hidden"
                      onClick={() => handleLinkClick('video', link.url)}
                    >
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="rounded-xl"
                      />
                    </div>
                  );
                }

                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick('video', link.url)}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
                  >
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Watch Video</p>
                      <p className="text-gray-400 text-sm">{link.title || getPlatformDisplayName(link.platform)}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Photo Gallery */}
        {epk.photos && epk.photos.length > 1 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {epk.photos.slice(1).map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-xl overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`${epk.artist_name} photo ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Social Links */}
        {epk.social_links && epk.social_links.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Connect</h2>
            <div className="flex flex-wrap gap-3">
              {epk.social_links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick('social', link.url)}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-3 hover:bg-white/20 transition-colors text-white"
                >
                  {getSocialIcon(link.platform)}
                  <span>{getPlatformDisplayName(link.platform)}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        {epk.contact_email && (
          <section className="text-center py-8">
            <h2 className="text-2xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-400 mb-6">
              Interested in booking {epk.artist_name}? Reach out!
            </p>
            <a
              href={`mailto:${epk.contact_email}`}
              onClick={() => handleLinkClick('contact', epk.contact_email!)}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact for Booking
            </a>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            Created with{' '}
            <a href="/" className="text-purple-400 hover:text-purple-300">
              QuickEPK
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
