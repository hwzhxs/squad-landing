'use client';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplitText from '@/components/SplitText';
import { useGlobalAudio } from '@/context/GlobalAudioContext';

// Base path prefix for GitHub Pages
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const HERO_VIDEOS = [`${BASE}/hero-videos/hero-1.mp4`];

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [heroInView, setHeroInView] = useState(true);
  const [sloganVisible, setSloganVisible] = useState(false);

  const { muted, mutedRef, toggleMute, registerVideo, unregisterVideo } = useGlobalAudio();

  // Register hero video with global audio on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    registerVideo(video);
    return () => unregisterVideo(video);
  }, [registerVideo, unregisterVideo]);

  // Load and play the single hero video on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = HERO_VIDEOS[0];
    video.muted = mutedRef.current ?? true;
    video.loop = true;
    video.load();
    video.play().catch(() => {/* autoplay blocked */});
  }, [mutedRef]);

  // Keep muted in sync with global state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) video.volume = 1;
  }, [muted]);

  // Scroll listener: reveal slogan when user scrolls > 80px
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setSloganVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver: track hero visibility
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  // Mute when hero scrolls out of view (don't unmute — respect global state)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!heroInView) {
      video.muted = true;
    } else {
      video.muted = muted;
    }
  }, [heroInView, muted]);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative flex min-h-[85vh] items-center justify-center px-6 overflow-hidden"
    >
      {/* Video hero background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.72)' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at top, rgba(26,26,26,0.6) 0%, transparent 60%)' }}
        />
      </div>

      {/* Global mute button — controls all videos on the page */}
      <button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute all videos' : 'Mute all videos'}
        className="absolute bottom-6 right-6 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
        style={{ zIndex: 50, pointerEvents: 'auto' }}
      >
        {muted ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
            </svg>
            <span>Unmute</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
            </svg>
            <span>Mute</span>
          </>
        )}
      </button>

      {/* Slogan — char-by-char cinematic reveal on scroll */}
      <AnimatePresence>
        {sloganVisible && (
          <div className="relative z-10 mx-auto max-w-[900px] text-center" style={{ perspective: '1000px' }}>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-normal leading-[1.1] tracking-[-0.02em] text-text-primary">
              <SplitText
                text="Four agents. One mission."
                delay={50}
                animationFrom={{ opacity: 0, transform: 'translateY(20px)' }}
                animationTo={{ opacity: 1, transform: 'translateY(0)' }}
                easing="easeOutCubic"
                threshold={0.1}
                rootMargin="-50px"
              />
            </h1>
            <p className="mx-auto mt-8 max-w-[600px] text-lg text-text-secondary">
              <SplitText
                text="Think it, build it, check it, ship it."
                animateBy="words"
                delay={80}
                animationFrom={{ opacity: 0, transform: 'translateY(12px)' }}
                animationTo={{ opacity: 1, transform: 'translateY(0)' }}
                easing="easeOutCubic"
                threshold={0.1}
                rootMargin="-50px"
              />
            </p>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
