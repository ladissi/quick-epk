'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="landing-container min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Organic background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary pulsing blob */}
        <div
          className={`absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full blur-[120px] transition-all duration-1000 ${
            mounted ? 'opacity-30' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, #7c3aed 0%, #a855f7 50%, transparent 70%)',
            animation: 'pulse-blob 8s ease-in-out infinite',
          }}
        />

        {/* Secondary blob */}
        <div
          className={`absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full blur-[100px] transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-20' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, #f472b6 50%, transparent 70%)',
            animation: 'pulse-blob 10s ease-in-out infinite reverse',
          }}
        />

        {/* Tertiary blob */}
        <div
          className={`absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full blur-[80px] transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-25' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, #6366f1 50%, transparent 70%)',
            animation: 'pulse-blob 12s ease-in-out infinite',
          }}
        />

        {/* Floating particles */}
        {mounted && (
          <>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${8 + Math.random() * 8}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Mesh texture overlay */}
      <div className="mesh-overlay" />

      {/* Navigation */}
      <nav className="relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="text-xl tracking-tight font-medium">
              QuickEPK
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-white text-black rounded-full hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-24 md:pt-32 pb-32 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Eyebrow */}
          <p
            className={`text-sm tracking-widest uppercase text-white/40 mb-6 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Electronic Press Kits for Artists
          </p>

          {/* Main headline */}
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8 transition-all duration-700 delay-100 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Your music
            <br />
            <span className="organic-text">deserves to be</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient">
              seen
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg md:text-xl text-white/50 max-w-xl mb-12 leading-relaxed transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Create a press kit that feels like you designed it yourself.
            Know when bookers view it. Follow up at the perfect moment.
          </p>

          {/* CTA */}
          <div
            className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Link
              href="/signup"
              className="group relative px-8 py-4 bg-white text-black rounded-full font-medium text-base overflow-hidden transition-transform hover:scale-105"
            >
              <span className="relative z-10">Create Your EPK — Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute inset-0 z-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                Create Your EPK — Free
              </span>
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 border border-white/20 rounded-full text-base text-white/70 hover:text-white hover:border-white/40 transition-all text-center"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* Visual break - organic divider */}
      <div className="relative h-32 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 0.05) 50%, transparent 100%)',
          }}
        />
        <svg
          className="absolute bottom-0 w-full h-16 text-white/5"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Features - Editorial layout */}
      <section id="how-it-works" className="relative z-10 py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Feature 1 */}
            <div className="group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-purple-500/50 transition-colors">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">View notifications</h3>
              <p className="text-white/50 leading-relaxed">
                The moment someone opens your EPK, you'll know. See where they're
                from, how they found you, and when they're most engaged.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group md:mt-16">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-pink-500/50 transition-colors">
                <div className="w-6 h-0.5 bg-pink-500 rounded-full animate-breathe" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Click tracking</h3>
              <p className="text-white/50 leading-relaxed">
                Understand what resonates. See which songs they play, which
                videos they watch, and when they reach for that contact button.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                <div
                  className="w-8 h-8 rounded-full border-2 border-blue-500/50"
                  style={{ animation: 'ripple 2s ease-out infinite' }}
                />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Unique to you</h3>
              <p className="text-white/50 leading-relaxed">
                Colors extracted from your photos. Layout that breathes with
                your content. Each EPK feels like a custom build, not a template.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group md:mt-16">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-green-500/50 transition-colors overflow-hidden">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-green-500 rounded-full"
                      style={{
                        height: '16px',
                        animation: `bar-bounce 1s ease-in-out infinite`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Built for musicians</h3>
              <p className="text-white/50 leading-relaxed">
                Spotify embeds, YouTube videos, SoundCloud players. Your music
                plays right in the EPK. No friction, no redirects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / Quote */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl text-white/10">
              "
            </div>
            <blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-white/80 italic">
              The reaction should be:{' '}
              <span className="text-white not-italic font-medium">
                "Damn, this looks good. Did you design this yourself?"
              </span>
            </blockquote>
            <p className="mt-6 text-white/40 text-sm tracking-widest uppercase">
              Our design philosophy
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-32 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start free, upgrade when ready
            </h2>
            <p className="text-white/50">No credit card required</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-lg font-medium mb-2">Free</h3>
              <p className="text-4xl font-bold mb-6">
                $0<span className="text-lg text-white/40 font-normal">/forever</span>
              </p>
              <ul className="space-y-3 mb-8 text-white/60">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  1 EPK with custom URL
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  5 photos
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  View tracking
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Click analytics
                </li>
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3 text-center rounded-full border border-white/20 hover:bg-white/5 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="absolute top-4 right-4 px-2 py-1 text-xs bg-white/10 rounded-full">
                Coming Soon
              </div>
              <h3 className="text-lg font-medium mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">
                $9<span className="text-lg text-white/40 font-normal">/month</span>
              </p>
              <ul className="space-y-3 mb-8 text-white/60">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Unlimited EPKs
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Unlimited photos
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Custom domain
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  Email notifications
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  PDF export
                </li>
              </ul>
              <button
                disabled
                className="block w-full py-3 text-center rounded-full bg-white/10 text-white/50 cursor-not-allowed"
              >
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to get
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              discovered?
            </span>
          </h2>
          <p className="text-white/50 mb-10 text-lg">
            Join artists who are landing more gigs with QuickEPK.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-white text-black rounded-full font-medium text-lg hover:scale-105 transition-transform"
          >
            Create Your Free EPK
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/40 text-sm">QuickEPK</div>
          <div className="text-white/30 text-sm">
            © {new Date().getFullYear()} QuickEPK. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/login" className="text-white/40 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-white/40 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .landing-container {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .grain-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 100;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .mesh-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          opacity: 0.3;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
          background-size: 40px 40px;
        }

        @keyframes pulse-blob {
          0%, 100% {
            transform: scale(1) translate(0, 0);
            opacity: 0.3;
          }
          33% {
            transform: scale(1.1) translate(20px, -20px);
            opacity: 0.4;
          }
          66% {
            transform: scale(0.95) translate(-10px, 10px);
            opacity: 0.25;
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
            opacity: 0.2;
          }
          75% {
            transform: translateY(-30px) translateX(5px);
            opacity: 0.3;
          }
        }

        @keyframes animate-gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% auto;
          animation: animate-gradient 4s ease infinite;
        }

        @keyframes breathe {
          0%, 100% {
            transform: scaleX(1);
            opacity: 0.5;
          }
          50% {
            transform: scaleX(1.5);
            opacity: 1;
          }
        }

        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }

        @keyframes ripple {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bar-bounce {
          0%, 100% {
            height: 8px;
          }
          50% {
            height: 20px;
          }
        }

        .organic-text {
          display: inline-block;
          animation: subtle-float 6s ease-in-out infinite;
        }

        @keyframes subtle-float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}
