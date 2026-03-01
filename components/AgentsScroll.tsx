'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { agents } from '@/lib/agents';

// ─── Helpers ───────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function AgentImage({
  agent,
  fromLeft,
  scrollProgress,
  index,
}: {
  agent: (typeof agents)[0];
  fromLeft: boolean;
  scrollProgress: ReturnType<typeof useMotionValue<number>>;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [scanPos, setScanPos] = useState(-10);
  const scanAnim = useRef<number | null>(null);
  const rgb = hexToRgb(agent.primary);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
  }, []);

  // Parallax
  const yOffset = useTransform(
    scrollProgress,
    [0, 1],
    fromLeft ? [-50, 50] : [50, -50],
  );

  // Scan sweep on hover — uses requestAnimationFrame for smooth animation
  useEffect(() => {
    if (hovered) {
      let pos = -10;
      let lastTime = 0;
      const speed = 150; // pixels-percent per second

      const tick = (time: number) => {
        if (!lastTime) lastTime = time;
        const dt = time - lastTime;
        lastTime = time;
        pos += speed * (dt / 1000);
        if (pos > 110) {
          setScanPos(-10);
          return; // animation complete
        }
        setScanPos(pos);
        scanAnim.current = requestAnimationFrame(tick);
      };

      setScanPos(-10);
      scanAnim.current = requestAnimationFrame(tick);
    } else {
      if (scanAnim.current) cancelAnimationFrame(scanAnim.current);
      setScanPos(-10);
    }
    return () => {
      if (scanAnim.current) cancelAnimationFrame(scanAnim.current);
    };
  }, [hovered]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="relative w-full"
      style={{ y: yOffset }}
      initial={{ opacity: 0, x: fromLeft ? -120 : 120, scale: 0.92 }}
      animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: fromLeft ? -120 : 120, scale: 0.92 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Glow pulse */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl"
        animate={
          hovered
            ? {
                boxShadow: [
                  `0 0 30px 8px rgba(${rgb}, 0.35)`,
                  `0 0 60px 20px rgba(${rgb}, 0.55)`,
                  `0 0 30px 8px rgba(${rgb}, 0.35)`,
                ],
              }
            : { boxShadow: `0 0 20px 0px rgba(${rgb}, 0.0)` }
        }
        transition={
          hovered
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.4 }
        }
      />

      {/* Image frame */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          boxShadow: `0 0 0 1px rgba(${rgb}, 0.2), 0 24px 80px rgba(0,0,0,0.5)`,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image
          src={agent.image}
          alt={`${agent.name} — ${agent.nickname}`}
          width={600}
          height={750}
          className="h-[68vh] w-full object-cover object-top"
          priority={index === 0}
        />

        {/* Scan sweep */}
        <AnimatePresence>
          {hovered && scanPos > -10 && scanPos < 110 && (
            <div
              className="pointer-events-none absolute inset-x-0 z-30"
              style={{
                top: `${scanPos}%`,
                height: '3px',
                background: `linear-gradient(90deg, transparent, rgba(${rgb}, 0.85), transparent)`,
                boxShadow: `0 0 12px 3px rgba(${rgb}, 0.5)`,
                filter: 'blur(0.5px)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* HUD corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <motion.div
          key={corner}
          className="pointer-events-none absolute z-40"
          style={{
            top: corner.startsWith('t') ? -4 : 'auto',
            bottom: corner.startsWith('b') ? -4 : 'auto',
            left: corner.endsWith('l') ? -4 : 'auto',
            right: corner.endsWith('r') ? -4 : 'auto',
            width: 20,
            height: 20,
            borderTop: corner.startsWith('t') ? `2px solid rgba(${rgb}, 0.9)` : 'none',
            borderBottom: corner.startsWith('b') ? `2px solid rgba(${rgb}, 0.9)` : 'none',
            borderLeft: corner.endsWith('l') ? `2px solid rgba(${rgb}, 0.9)` : 'none',
            borderRight: corner.endsWith('r') ? `2px solid rgba(${rgb}, 0.9)` : 'none',
          }}
          initial={{ opacity: 0, scale: 1.3 }}
          animate={
            hovered
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 1.3 }
          }
          transition={{ duration: 0.25 }}
        />
      ))}
    </motion.div>
  );
}

// ─── Agent text block ──────────────────────────────────────────────────────────
function AgentText({ agent, index }: { agent: (typeof agents)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.4 });
  const rgb = hexToRgb(agent.accent);
  const primaryRgb = hexToRgb(agent.primary);

  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 36 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 },
    transition: { duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  return (
    <div ref={ref} className="flex flex-col justify-center px-4 lg:px-10">
      {/* Ghost index number watermark */}
      <motion.span
        className="pointer-events-none absolute font-display font-black leading-none select-none"
        style={{
          fontSize: 'clamp(8rem, 22vw, 20rem)',
          color: `rgba(${primaryRgb}, 0.045)`,
          right: index % 2 === 0 ? '0' : 'auto',
          left: index % 2 === 0 ? 'auto' : '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 0,
          letterSpacing: '-0.05em',
        }}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 0.1 }}
      >
        {String(index + 1).padStart(2, '0')}
      </motion.span>

      <div className="relative z-10">
        {/* Emoji */}
        <motion.span className="block text-5xl leading-none" {...fade(0)}>
          {agent.emoji}
        </motion.span>

        {/* Name */}
        <motion.h2
          className="mt-3 font-display font-light leading-none tracking-tight text-white"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          {...fade(0.09)}
        >
          {agent.name}
        </motion.h2>

        {/* Subtitle — e.g. "The Police", "The Creator" */}
        <motion.p
          className="mt-0 font-display font-light leading-none tracking-tight text-white/40"
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)' }}
          {...fade(0.14)}
        >
          {agent.subtitle}
        </motion.p>

        {/* Divider */}
        <motion.div
          className="mt-5 h-px w-16 origin-left"
          style={{ backgroundColor: `rgba(${rgb}, 0.4)` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.55, delay: 0.32, ease: 'easeOut' }}
        />

        {/* Description */}
        <motion.p
          className="mt-5 max-w-xs text-lg leading-relaxed text-white/55"
          {...fade(0.38)}
        >
          {agent.description}
        </motion.p>
      </div>
    </div>
  );
}

// ─── Side dot nav ──────────────────────────────────────────────────────────────
function DotNav({
  active,
  onDotClick,
}: {
  active: number;
  onDotClick: (i: number) => void;
}) {
  return (
    <div className="pointer-events-auto fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {agents.map((agent, i) => {
        const rgb = hexToRgb(agent.primary);
        return (
          <motion.button
            key={i}
            onClick={() => onDotClick(i)}
            className="h-2.5 w-2.5 rounded-full focus:outline-none"
            data-cursor-hover
            aria-label={`Go to ${agent.name}`}
            animate={{
              scale: i === active ? 1.6 : 1,
              opacity: i === active ? 1 : 0.35,
              backgroundColor: i === active ? agent.primary : 'rgba(255,255,255,0.35)',
              boxShadow:
                i === active
                  ? `0 0 10px 3px rgba(${rgb}, 0.7)`
                  : '0 0 0 0 transparent',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

// ─── Spotlight (mouse glow on section bg) ─────────────────────────────────────
function SectionSpotlight({
  primaryColor,
  sectionRef,
}: {
  primaryColor: string;
  sectionRef: React.RefObject<HTMLElement>;
}) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const rgb = hexToRgb(primaryColor);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [sectionRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      style={{
        background: `radial-gradient(circle 380px at ${pos.x}px ${pos.y}px, rgba(${rgb}, 0.13), transparent 70%)`,
        transition: 'background 0.04s linear',
      }}
    />
  );
}

// ─── Individual agent section ──────────────────────────────────────────────────
function AgentSection({
  agent,
  index,
  onVisible,
  sectionRefs,
}: {
  agent: (typeof agents)[0];
  index: number;
  onVisible: (i: number) => void;
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}) {
  const fromLeft = index % 2 === 0;
  const sectionRef = useRef<HTMLElement>(null);

  // Register ref
  useEffect(() => {
    sectionRefs.current[index] = sectionRef.current;
  });

  // IntersectionObserver for active dot
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onVisible(index);
      },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onVisible, sectionRefs]);

  // Scroll progress for parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      id={`agent-${index}`}
      className="relative flex h-screen w-full items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${agent.gradientFrom} 0%, ${agent.gradientTo} 100%)`,
      }}
    >
      {/* Section spotlight */}
      <SectionSpotlight
        primaryColor={agent.primary}
        sectionRef={sectionRef as React.RefObject<HTMLElement>}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 35%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Content grid */}
      <div
        className="relative z-30 mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-8 md:grid-cols-2 md:px-16 lg:px-24"
      >
        {fromLeft ? (
          <>
            <AgentImage
              agent={agent}
              fromLeft
              scrollProgress={scrollYProgress as ReturnType<typeof useMotionValue<number>>}
              index={index}
            />
            <AgentText agent={agent} index={index} />
          </>
        ) : (
          <>
            <AgentText agent={agent} index={index} />
            <AgentImage
              agent={agent}
              fromLeft={false}
              scrollProgress={scrollYProgress as ReturnType<typeof useMotionValue<number>>}
              index={index}
            />
          </>
        )}
      </div>
    </section>
  );
}

// ─── Root component ────────────────────────────────────────────────────────────
export default function AgentsScroll() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const handleVisible = useCallback((i: number) => setActiveIndex(i), []);

  const scrollToSection = useCallback((i: number) => {
    const el = sectionRefs.current[i];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="relative" id="agents">
      {agents.map((agent, i) => (
        <AgentSection
          key={agent.nickname}
          agent={agent}
          index={i}
          onVisible={handleVisible}
          sectionRefs={sectionRefs}
        />
      ))}

      {/* Side dot nav */}
      <DotNav active={activeIndex} onDotClick={scrollToSection} />
    </div>
  );
}
