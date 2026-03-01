'use client';

import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplitText from '@/components/SplitText';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const [muted, setMuted] = useState(true);
  const [sloganVisible, setSloganVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) setSloganVisible(true);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Imperatively sync muted state — React's muted prop doesn't reliably update the DOM
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (muted) {
      video.muted = true;
    } else {
      video.volume = 1;
      video.muted = false;
      // Browsers require a play() call after unmuting in some cases
      if (video.paused) {
        video.play().catch(() => {
          // Autoplay policy blocked — re-mute
          setMuted(true);
        });
      }
    }
  }, [muted]);

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    
    const nextMuted = !muted;
    
    if (!nextMuted) {
      // Attempting to unmute — do it imperatively first (user gesture is active NOW)
      video.volume = 1;
      video.muted = false;
      if (video.paused) {
        video.play().catch(() => {
          video.muted = true;
          return; // Don't update state if failed
        });
      }
    } else {
      video.muted = true;
    }
    
    setMuted(nextMuted);
  }

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
          src={`${BASE}/hero-video-h264.mp4`}
          autoPlay
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-center"
          // NOTE: Do NOT put `muted` attribute here — controlled imperatively via ref
        />
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.72)' }} />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at top, rgba(26,26,26,0.6) 0%, transparent 60%)' }}
        />
      </div>

      {/* Audio Toggle Button — top-right, above all overlays */}
      <motion.button
        onClick={toggleMute}
        aria-label={muted ? 'Unmute video' : 'Mute video'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backdropFilter: 'blur(8px)',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: muted ? 'rgba(255,255,255,0.5)' : 'rgba(212,175,55,0.9)',
          boxShadow: muted ? 'none' : '0 0 14px rgba(212,175,55,0.3)',
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        {muted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:'16px',height:'16px'}}>
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.78 9.22a.75.75 0 10-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 101.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 101.06-1.06L20.56 12l1.72-1.72a.75.75 0 00-1.06-1.06l-1.72 1.72-1.72-1.72z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{width:'16px',height:'16px'}}>
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905H6.44l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
            <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.061z" />
          </svg>
        )}
      </motion.button>

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
