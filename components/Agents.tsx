'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion';
import { agents } from '@/lib/agents';

// ─── Hex → rgb ────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// ─── 3-D tilt image ───────────────────────────────────────────────────────────
function TiltImage({
  agent,
  fromLeft,
  scrollY,
}: {
  agent: typeof agents[0];
  fromLeft: boolean;
  scrollY: ReturnType<typeof useMotionValue<number>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(rawX, { stiffness: 200, damping: 25 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      rawX.set(((e.clientX - left) / width - 0.5) * 30);
      rawY.set(-((e.clientY - top) / height - 0.5) * 30);
    },
    [rawX, rawY],
  );

  const onMouseEnter = useCallback(() => {
    setHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  }, [rawX, rawY]);

  const glowRgb = hexToRgb(agent.primary);

  // Parallax: scrollY is normalized 0→1 for this section; shift image slightly
  const yOffset = useTransform(scrollY, [0, 1], fromLeft ? [-40, 40] : [40, -40]);

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-[45%] md:w-[40%]"
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 800,
        y: yOffset,
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: hovered
          ? `0 0 60px 20px rgba(${glowRgb}, 0.45), 0 0 120px 40px rgba(${glowRgb}, 0.2)`
          : `0 0 30px 0 rgba(${glowRgb}, 0)`,
        transition: 'box-shadow 0.4s ease',
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, x: fromLeft ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(${glowRgb}, 0.18), transparent 70%)`,
        }}
      />
      <div className="aspect-[3/5] w-full">
        <Image
          src={agent.image}
          alt={`${agent.name} — ${agent.nickname}`}
          width={600}
          height={1000}
          className="relative z-0 h-full w-full object-cover object-top"
          priority
        />
      </div>
    </motion.div>
  );
}

// ─── Staggered text block ─────────────────────────────────────────────────────
function AgentText({ agent, index }: { agent: typeof agents[0]; index: number }) {
  const accentRgb = hexToRgb(agent.accent);

  const stagger = (delay: number) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.4 } as const,
    transition: { duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  });

  const indexLabel = String(index + 1).padStart(2, '0');

  return (
    <div className="flex flex-col justify-center px-4 lg:px-10">
      <motion.span
        className="mb-3 font-mono text-xs tracking-widest"
        style={{ color: 'rgba(255,255,255,0.35)' }}
        {...stagger(0)}
      >
        {indexLabel} &nbsp;———
      </motion.span>

      <motion.span className="block text-[3.5rem] leading-none" {...stagger(0.04)}>
        {agent.emoji}
      </motion.span>

      <motion.h2
        className="mt-2 font-display font-light leading-none tracking-tight text-white"
        style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)' }}
        {...stagger(0.08)}
      >
        {agent.name}
      </motion.h2>

      <motion.p
        className="mt-1 font-mono text-sm font-medium tracking-wider"
        style={{ color: agent.accent }}
        {...stagger(0.12)}
      >
        {agent.subtitle}
      </motion.p>

      <motion.div
        className="mt-5 h-px w-16 origin-left"
        style={{ backgroundColor: `rgba(${accentRgb}, 0.4)` }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 0.24, ease: 'easeOut' }}
      />

      <motion.p
        className="mt-5 max-w-xs text-lg leading-relaxed text-white/60"
        {...stagger(0.3)}
      >
        {agent.description}
      </motion.p>

      <motion.p
        className="mt-4 font-mono text-xs"
        style={{ color: 'rgba(255,255,255,0.15)' }}
        {...stagger(0.38)}
      >
        {`<agent-role="${agent.role}" status="online" />`}
      </motion.p>
    </div>
  );
}

// ─── Dot indicator ────────────────────────────────────────────────────────────
function DotIndicator({ active }: { active: number }) {
  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3">
      {agents.map((agent, i) => {
        const rgb = hexToRgb(agent.primary);
        return (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full"
            animate={{
              scale: i === active ? 2 : 1,
              opacity: i === active ? 1 : 0.35,
              backgroundColor: i === active ? agent.primary : 'rgba(255,255,255,0.4)',
            }}
            style={{
              boxShadow:
                i === active ? `0 0 8px 2px rgba(${rgb}, 0.7)` : 'none',
            }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
}

// ─── Spotlight cursor ─────────────────────────────────────────────────────────
function SpotlightCursor({
  containerRef,
  primaryColor,
}: {
  containerRef: React.RefObject<HTMLElement>;
  primaryColor: string;
}) {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const rgb = hexToRgb(primaryColor);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, [containerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{
        background: `radial-gradient(circle 320px at ${pos.x}px ${pos.y}px, rgba(${rgb}, 0.15), transparent 70%)`,
        transition: 'background 0.04s linear',
      }}
    />
  );
}

// ─── Individual agent section ─────────────────────────────────────────────────
function AgentSection({
  agent,
  index,
  onVisible,
}: {
  agent: typeof agents[0];
  index: number;
  onVisible: (i: number) => void;
}) {
  const fromLeft = index % 2 === 0;
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(index); },
      { threshold: 0.5 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [index, onVisible]);

  const { scrollYProgress: sectionScroll } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${agent.gradientFrom} 0%, ${agent.gradientTo} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div
        className="relative z-30 mx-auto grid h-full w-full max-w-[1400px] grid-cols-1 items-center gap-8 px-8 md:grid-cols-2 md:px-16 lg:px-24"
      >
        {fromLeft ? (
          <>
            <TiltImage agent={agent} fromLeft scrollY={sectionScroll as unknown as ReturnType<typeof useMotionValue<number>>} />
            <AgentText agent={agent} index={index} />
          </>
        ) : (
          <>
            <AgentText agent={agent} index={index} />
            <TiltImage agent={agent} fromLeft={false} scrollY={sectionScroll as unknown as ReturnType<typeof useMotionValue<number>>} />
          </>
        )}
      </div>
    </section>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function Agents() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleVisible = useCallback((i: number) => setActiveIndex(i), []);

  return (
    <div ref={containerRef} className="relative cursor-none" id="agents">
      <SpotlightCursor
        containerRef={containerRef as React.RefObject<HTMLElement>}
        primaryColor={agents[activeIndex].primary}
      />

      {agents.map((agent, i) => (
        <AgentSection
          key={agent.nickname}
          agent={agent}
          index={i}
          onVisible={handleVisible}
        />
      ))}

      <DotIndicator active={activeIndex} />
    </div>
  );
}


