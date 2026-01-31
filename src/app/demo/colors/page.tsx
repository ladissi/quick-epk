'use client';

import { useState, useEffect } from 'react';
import { extractColors, ColorPalette, defaultPalette } from '@/lib/colors';

// Sample images with different color profiles
const sampleImages = [
  {
    name: 'Warm Sunset',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    name: 'Cool Blue',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  },
  {
    name: 'Neon Pink',
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
  },
  {
    name: 'Dark Moody',
    url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800',
  },
  {
    name: 'Forest Green',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
  },
  {
    name: 'Desert Sand',
    url: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
  },
];

export default function ColorDemoPage() {
  const [palette, setPalette] = useState<ColorPalette>(defaultPalette);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Interactive controls
  const [blobSize, setBlobSize] = useState(400);
  const [blobOpacity, setBlobOpacity] = useState(0.6);
  const [blobSpeed, setBlobSpeed] = useState(8);
  const [particleCount, setParticleCount] = useState(15);
  const [blurAmount, setBlurAmount] = useState(80);

  useEffect(() => {
    setMounted(true);
  }, []);

  const extractForImage = async (url: string) => {
    setLoading(true);
    setSelectedImage(url);
    const colors = await extractColors(url);
    setPalette(colors);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Main demo area */}
      <div
        className="relative min-h-screen overflow-hidden transition-colors duration-1000"
        style={{
          background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.dominant} 100%)`,
        }}
      >
        {/* ORGANIC BLOBS - Made very visible */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Blob 1 - Top right, dominant color */}
          <div
            className="absolute rounded-full"
            style={{
              top: '-10%',
              right: '-5%',
              width: `${blobSize}px`,
              height: `${blobSize}px`,
              background: `radial-gradient(circle, ${palette.dominant} 0%, ${palette.dominant}88 40%, transparent 70%)`,
              filter: `blur(${blurAmount}px)`,
              opacity: blobOpacity,
              animation: `blob-pulse ${blobSpeed}s ease-in-out infinite`,
            }}
          />

          {/* Blob 2 - Left side, accent color */}
          <div
            className="absolute rounded-full"
            style={{
              top: '30%',
              left: '-10%',
              width: `${blobSize * 0.8}px`,
              height: `${blobSize * 0.8}px`,
              background: `radial-gradient(circle, ${palette.accent} 0%, ${palette.accent}88 40%, transparent 70%)`,
              filter: `blur(${blurAmount * 0.8}px)`,
              opacity: blobOpacity * 0.8,
              animation: `blob-pulse ${blobSpeed * 1.3}s ease-in-out infinite reverse`,
            }}
          />

          {/* Blob 3 - Bottom center, muted color */}
          <div
            className="absolute rounded-full"
            style={{
              bottom: '-15%',
              left: '30%',
              width: `${blobSize * 0.9}px`,
              height: `${blobSize * 0.9}px`,
              background: `radial-gradient(circle, ${palette.muted} 0%, ${palette.muted}88 40%, transparent 70%)`,
              filter: `blur(${blurAmount * 0.9}px)`,
              opacity: blobOpacity * 0.7,
              animation: `blob-pulse ${blobSpeed * 1.5}s ease-in-out infinite`,
              animationDelay: '2s',
            }}
          />

          {/* Blob 4 - Extra blob for more movement */}
          <div
            className="absolute rounded-full"
            style={{
              top: '60%',
              right: '10%',
              width: `${blobSize * 0.6}px`,
              height: `${blobSize * 0.6}px`,
              background: `radial-gradient(circle, ${palette.text}44 0%, transparent 70%)`,
              filter: `blur(${blurAmount * 0.6}px)`,
              opacity: blobOpacity * 0.5,
              animation: `blob-pulse ${blobSpeed * 0.8}s ease-in-out infinite`,
              animationDelay: '1s',
            }}
          />

          {/* Floating particles */}
          {mounted && [...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${5 + (i * 6.5) % 90}%`,
                top: `${10 + (i * 7.3) % 80}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                background: palette.text,
                opacity: 0.3,
                animation: `particle-drift ${10 + (i % 5) * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 md:p-12">
          {/* Header */}
          <div className="mb-12">
            <h1
              className="text-5xl md:text-7xl font-bold mb-4 transition-colors duration-500"
              style={{ color: palette.text }}
            >
              Organic Colors
            </h1>
            <p
              className="text-lg opacity-60 max-w-xl transition-colors duration-500"
              style={{ color: palette.text }}
            >
              Click an image below to extract its colors. Watch how the pulsating blobs
              and floating particles adapt to create a unique atmosphere.
            </p>
          </div>

          {/* Image selector */}
          <div className="flex flex-wrap gap-3 mb-12">
            {sampleImages.map((img) => (
              <button
                key={img.url}
                onClick={() => extractForImage(img.url)}
                className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 ${
                  selectedImage === img.url ? 'border-white scale-110' : 'border-white/20'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                {loading && selectedImage === img.url && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Color swatches */}
          <div className="flex flex-wrap gap-4 mb-12">
            {[
              { label: 'Dominant', color: palette.dominant },
              { label: 'Muted', color: palette.muted },
              { label: 'Accent', color: palette.accent },
              { label: 'Background', color: palette.background },
              { label: 'Text', color: palette.text },
            ].map((swatch) => (
              <div key={swatch.label} className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-lg border border-white/30 shadow-lg"
                  style={{ background: swatch.color }}
                />
                <div>
                  <p className="text-xs opacity-50" style={{ color: palette.text }}>{swatch.label}</p>
                  <p className="text-xs font-mono opacity-80" style={{ color: palette.text }}>{swatch.color}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive controls */}
          <div
            className="p-6 rounded-2xl border max-w-2xl"
            style={{
              background: `${palette.background}88`,
              borderColor: `${palette.text}22`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <h3
              className="text-lg font-semibold mb-6"
              style={{ color: palette.text }}
            >
              Adjust Organic Elements
            </h3>

            <div className="space-y-6">
              {/* Blob Size */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm opacity-70" style={{ color: palette.text }}>
                    Blob Size
                  </label>
                  <span className="text-sm font-mono opacity-50" style={{ color: palette.text }}>
                    {blobSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="800"
                  value={blobSize}
                  onChange={(e) => setBlobSize(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Blob Opacity */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm opacity-70" style={{ color: palette.text }}>
                    Blob Opacity
                  </label>
                  <span className="text-sm font-mono opacity-50" style={{ color: palette.text }}>
                    {(blobOpacity * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={blobOpacity * 100}
                  onChange={(e) => setBlobOpacity(Number(e.target.value) / 100)}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Blur Amount */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm opacity-70" style={{ color: palette.text }}>
                    Blur Amount
                  </label>
                  <span className="text-sm font-mono opacity-50" style={{ color: palette.text }}>
                    {blurAmount}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Animation Speed */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm opacity-70" style={{ color: palette.text }}>
                    Pulse Speed
                  </label>
                  <span className="text-sm font-mono opacity-50" style={{ color: palette.text }}>
                    {blobSpeed}s
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={blobSpeed}
                  onChange={(e) => setBlobSpeed(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Particle Count */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm opacity-70" style={{ color: palette.text }}>
                    Floating Particles
                  </label>
                  <span className="text-sm font-mono opacity-50" style={{ color: palette.text }}>
                    {particleCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={particleCount}
                  onChange={(e) => setParticleCount(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12">
            <a
              href="/"
              className="text-sm opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: palette.text }}
            >
              ← Back to QuickEPK
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob-pulse {
          0%, 100% {
            transform: scale(1) translate(0, 0);
          }
          25% {
            transform: scale(1.1) translate(20px, -20px);
          }
          50% {
            transform: scale(0.95) translate(-10px, 30px);
          }
          75% {
            transform: scale(1.05) translate(-20px, -10px);
          }
        }

        @keyframes particle-drift {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-40px) translateX(20px) scale(1.2);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) translateX(-15px) scale(0.8);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-60px) translateX(10px) scale(1.1);
            opacity: 0.4;
          }
        }

        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
