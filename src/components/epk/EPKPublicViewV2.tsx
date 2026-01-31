'use client';

import { useEffect, useState, useRef } from 'react';
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
} from '@/lib/utils';
import { extractColors, ColorPalette, defaultPalette, paletteToCSS } from '@/lib/colors';

interface EPKPublicViewProps {
  epk: EPK;
}

export default function EPKPublicViewV2({ epk }: EPKPublicViewProps) {
  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackView(epk.id);
    const cleanup = setupPageUnloadTracking(epk.id);
    return cleanup;
  }, [epk.id]);

  // Extract colors from hero image
  useEffect(() => {
    if (epk.photos && epk.photos.length > 0) {
      extractColors(epk.photos[0]).then((colors) => {
        setPalette(colors);
        setLoaded(true);
      });
    } else {
      setLoaded(true);
    }
  }, [epk.photos]);

  const handleLinkClick = (
    type: 'music' | 'video' | 'social' | 'contact',
    url: string
  ) => {
    trackClick(epk.id, type, url);
  };

  const cssVars = paletteToCSS(palette);

  return (
    <div
      ref={containerRef}
      className={`epk-container min-h-screen transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      style={{
        ...cssVars,
        background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.dominant} 100%)`,
      } as React.CSSProperties}
    >
      {/* Organic background elements - visible throughout including hero */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[5]">
        {/* Primary pulsing blob - top area, very visible */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full organic-blob-1"
          style={{
            background: `radial-gradient(circle, ${palette.accent} 0%, ${palette.accent}66 30%, transparent 60%)`,
            filter: 'blur(80px)',
            opacity: 0.5,
          }}
        />

        {/* Secondary blob - left side */}
        <div
          className="absolute top-[20%] -left-32 w-[500px] h-[500px] rounded-full organic-blob-2"
          style={{
            background: `radial-gradient(circle, ${palette.dominant} 0%, ${palette.dominant}66 30%, transparent 60%)`,
            filter: 'blur(60px)',
            opacity: 0.4,
          }}
        />

        {/* Tertiary blob - center-bottom */}
        <div
          className="absolute top-[60%] left-[20%] w-[450px] h-[450px] rounded-full organic-blob-3"
          style={{
            background: `radial-gradient(circle, ${palette.muted} 0%, ${palette.muted}66 30%, transparent 60%)`,
            filter: 'blur(70px)',
            opacity: 0.35,
          }}
        />

        {/* Fourth blob for more movement */}
        <div
          className="absolute top-[40%] right-[10%] w-[350px] h-[350px] rounded-full organic-blob-1"
          style={{
            background: `radial-gradient(circle, ${palette.text}22 0%, transparent 60%)`,
            filter: 'blur(50px)',
            opacity: 0.3,
            animationDelay: '3s',
          }}
        />

        {/* Floating particles */}
        {loaded && [...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full floating-particle"
            style={{
              left: `${8 + (i * 6) % 85}%`,
              top: `${12 + (i * 7) % 75}%`,
              width: `${3 + (i % 3) * 2}px`,
              height: `${3 + (i % 3) * 2}px`,
              background: palette.text,
              opacity: 0.2,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Film grain overlay */}
      <div className="grain-overlay" />

      {/* Hero Section - Full viewport, cinematic */}
      <section className="relative min-h-screen flex items-end">
        {epk.photos && epk.photos.length > 0 && (
          <>
            <div className="absolute inset-0">
              <img
                src={epk.photos[0]}
                alt={epk.artist_name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(0deg, ${palette.background} 0%, ${palette.background}99 25%, transparent 50%, transparent 60%, ${palette.background}66 100%)`,
                }}
              />
              {/* Extra vignette for corners */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
                }}
              />
            </div>
          </>
        )}

        {/* Hero content */}
        <div className="relative z-10 w-full px-6 md:px-12 pb-12 md:pb-20">
          <div className="max-w-5xl">
            {/* Genre/Location tag */}
            {(epk.genre || epk.location) && (
              <p
                className="text-sm md:text-base tracking-widest uppercase mb-4"
                style={{
                  color: palette.text,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.3)',
                }}
              >
                {[epk.genre, epk.location].filter(Boolean).join(' · ')}
              </p>
            )}

            {/* Artist name - large, impactful */}
            <h1
              className="text-5xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none mb-6"
              style={{
                color: palette.text,
                textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.4)',
              }}
            >
              {epk.artist_name}
            </h1>

            {/* Quick links */}
            <div className="flex flex-wrap gap-3">
              {epk.music_links && epk.music_links.length > 0 && (
                <a
                  href={epk.music_links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleLinkClick('music', epk.music_links[0].url)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: palette.text,
                    color: palette.background,
                  }}
                >
                  Listen Now
                </a>
              )}
              {epk.contact_email && (
                <a
                  href={`mailto:${epk.contact_email}`}
                  onClick={() => handleLinkClick('contact', epk.contact_email!)}
                  className="px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 border"
                  style={{
                    borderColor: `${palette.text}44`,
                    color: palette.text,
                  }}
                >
                  Get in Touch
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 opacity-50"
            style={{ color: palette.text }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Bio Section - Editorial layout */}
      {epk.bio && (
        <section className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-3xl">
            <p
              className="text-xl md:text-2xl lg:text-3xl leading-relaxed font-light"
              style={{ color: palette.text }}
            >
              {epk.bio}
            </p>
          </div>
        </section>
      )}

      {/* Music Section - Immersive */}
      {epk.music_links && epk.music_links.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <h2
            className="text-sm tracking-widest uppercase mb-8 opacity-50"
            style={{ color: palette.text }}
          >
            Music
          </h2>

          <div className="space-y-6">
            {epk.music_links.map((link, index) => {
              const spotifyEmbed = link.platform === 'spotify' ? getSpotifyEmbedUrl(link.url) : null;

              if (spotifyEmbed) {
                return (
                  <div key={index} className="rounded-xl overflow-hidden max-w-2xl">
                    <iframe
                      src={spotifyEmbed}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
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
                  className="group flex items-center gap-4 py-4 border-b transition-all hover:pl-4"
                  style={{ borderColor: `${palette.text}22` }}
                >
                  <span
                    className="text-lg md:text-xl font-medium"
                    style={{ color: palette.text }}
                  >
                    {link.platform.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <svg
                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: palette.text }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* Videos Section */}
      {epk.video_links && epk.video_links.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <h2
            className="text-sm tracking-widest uppercase mb-8 opacity-50"
            style={{ color: palette.text }}
          >
            Video
          </h2>

          <div className="grid gap-6 md:gap-8">
            {epk.video_links.map((link, index) => {
              const youtubeId = getYouTubeVideoId(link.url);
              const vimeoId = getVimeoVideoId(link.url);

              if (youtubeId) {
                return (
                  <div
                    key={index}
                    className="aspect-video rounded-xl overflow-hidden max-w-4xl"
                    onClick={() => handleLinkClick('video', link.url)}
                  >
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }

              if (vimeoId) {
                return (
                  <div
                    key={index}
                    className="aspect-video rounded-xl overflow-hidden max-w-4xl"
                    onClick={() => handleLinkClick('video', link.url)}
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${vimeoId}`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>
        </section>
      )}

      {/* Photo Gallery - Asymmetric grid */}
      {epk.photos && epk.photos.length > 1 && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <h2
            className="text-sm tracking-widest uppercase mb-8 opacity-50"
            style={{ color: palette.text }}
          >
            Photos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {epk.photos.slice(1).map((photo, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg ${
                  index === 0 ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img
                  src={photo}
                  alt={`${epk.artist_name} photo ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Social Links */}
      {epk.social_links && epk.social_links.length > 0 && (
        <section className="px-6 md:px-12 py-16 md:py-24">
          <h2
            className="text-sm tracking-widest uppercase mb-8 opacity-50"
            style={{ color: palette.text }}
          >
            Connect
          </h2>

          <div className="flex flex-wrap gap-4">
            {epk.social_links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick('social', link.url)}
                className="text-lg md:text-xl font-medium hover:opacity-70 transition-opacity"
                style={{ color: palette.text }}
              >
                {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {epk.contact_email && (
        <section className="px-6 md:px-12 py-20 md:py-32">
          <div className="max-w-2xl">
            <h2
              className="text-3xl md:text-5xl font-bold mb-6"
              style={{ color: palette.text }}
            >
              Let's work together
            </h2>
            <a
              href={`mailto:${epk.contact_email}`}
              onClick={() => handleLinkClick('contact', epk.contact_email!)}
              className="inline-block text-xl md:text-2xl font-medium hover:opacity-70 transition-opacity border-b-2 pb-1"
              style={{ color: palette.text, borderColor: palette.text }}
            >
              {epk.contact_email}
            </a>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className="px-6 md:px-12 py-8 border-t"
        style={{ borderColor: `${palette.text}11` }}
      >
        <p className="text-xs opacity-30" style={{ color: palette.text }}>
          <a href="/" className="hover:opacity-100 transition-opacity">
            QuickEPK
          </a>
        </p>
      </footer>

      <style jsx global>{`
        .epk-container {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Organic blob animations */
        .organic-blob-1 {
          animation: blob-drift-1 20s ease-in-out infinite;
        }

        .organic-blob-2 {
          animation: blob-drift-2 25s ease-in-out infinite;
        }

        .organic-blob-3 {
          animation: blob-drift-3 18s ease-in-out infinite;
        }

        @keyframes blob-drift-1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.4;
          }
          33% {
            transform: translate(-30px, 40px) scale(1.1);
            opacity: 0.5;
          }
          66% {
            transform: translate(20px, -20px) scale(0.95);
            opacity: 0.35;
          }
        }

        @keyframes blob-drift-2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(40px, -30px) scale(1.15);
            opacity: 0.3;
          }
        }

        @keyframes blob-drift-3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.3;
          }
          33% {
            transform: translate(25px, 20px) scale(1.05);
            opacity: 0.35;
          }
          66% {
            transform: translate(-15px, -25px) scale(0.9);
            opacity: 0.25;
          }
        }

        /* Floating particles */
        .floating-particle {
          animation: particle-float 12s ease-in-out infinite;
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          25% {
            transform: translateY(-30px) translateX(15px);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-15px) translateX(-10px);
            opacity: 0.15;
          }
          75% {
            transform: translateY(-40px) translateX(8px);
            opacity: 0.2;
          }
        }

        @keyframes breathe {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }

        .animate-breathe {
          animation: breathe 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
