'use client';

/**
 * SplitText — react-bits inspired text animation component
 * CSS-based (no GSAP required), mirrors the react-bits SplitText API.
 *
 * Props reference: https://reactbits.dev/text-animations/split-text
 */

import { useRef, useEffect, useState, CSSProperties } from 'react';

type EasingKey =
  | 'power3.out'
  | 'power2.out'
  | 'power4.out'
  | 'easeOutCubic'
  | 'easeOutQuart'
  | 'easeOut'
  | 'easeIn'
  | 'easeInOut'
  | 'linear';

const easingMap: Record<string, string> = {
  'power3.out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'power2.out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'power4.out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeOutCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
  easeInOut: 'ease-in-out',
  linear: 'linear',
};

interface AnimStyles {
  opacity?: number;
  y?: number;
  x?: number;
  /** Raw CSS transform string (overrides x/y) */
  transform?: string;
  filter?: string;
}

interface SplitTextProps {
  text: string;
  className?: string;
  /** Stagger delay between each unit in ms (react-bits uses seconds/1000) */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  ease?: EasingKey | string;
  /** 'chars' | 'words' | 'lines' */
  splitType?: 'chars' | 'words' | 'lines';
  /** @deprecated use splitType — kept for backward compat */
  animateBy?: 'chars' | 'words';
  from?: AnimStyles;
  to?: AnimStyles;
  /** @deprecated use from — kept for backward compat */
  animationFrom?: { opacity?: number; transform?: string };
  /** @deprecated use to — kept for backward compat */
  animationTo?: { opacity?: number; transform?: string };
  /** @deprecated use ease — kept for backward compat */
  easing?: string;
  threshold?: number;
  rootMargin?: string;
  /** Wrapper tag — only used when splitType is not 'chars'/'words' */
  tag?: keyof JSX.IntrinsicElements;
  textAlign?: CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

function buildTransform(styles?: AnimStyles): string {
  if (!styles) return 'none';
  if (styles.transform) return styles.transform;
  const parts: string[] = [];
  if (styles.y != null) parts.push(`translateY(${styles.y}px)`);
  if (styles.x != null) parts.push(`translateX(${styles.x}px)`);
  return parts.length ? parts.join(' ') : 'none';
}

export default function SplitText({
  text,
  className = '',
  delay = 50,
  duration = 0.6,
  ease: easeProp,
  easing,
  splitType,
  animateBy,
  from,
  to,
  animationFrom,
  animationTo,
  threshold = 0.1,
  rootMargin = '-50px',
  textAlign = 'inherit',
  onLetterAnimationComplete,
}: SplitTextProps) {
  // Resolve ease — new `ease` prop takes precedence over legacy `easing`
  const ease = easeProp ?? easing ?? 'power3.out';
  const containerRef = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const completedRef = useRef(false);

  // Resolve split type — new API takes precedence
  const resolvedSplitType: 'chars' | 'words' = splitType === 'words' ? 'words' : (animateBy === 'words' ? 'words' : 'chars');

  // Resolve animation styles — new API takes precedence over legacy props
  const resolvedFrom: AnimStyles = from ?? (animationFrom ? {
    opacity: animationFrom.opacity,
    transform: animationFrom.transform,
  } : { opacity: 0, y: 40 });

  const resolvedTo: AnimStyles = to ?? (animationTo ? {
    opacity: animationTo.opacity,
    transform: animationTo.transform,
  } : { opacity: 1, y: 0 });

  const easingCss = easingMap[ease] ?? ease;
  const durationMs = duration * 1000;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  const units = resolvedSplitType === 'words' ? text.split(' ') : text.split('');

  // Fire onLetterAnimationComplete after last unit finishes
  useEffect(() => {
    if (!isVisible || completedRef.current || !onLetterAnimationComplete) return;
    const lastDelay = (units.length - 1) * delay + durationMs;
    const timer = setTimeout(() => {
      completedRef.current = true;
      onLetterAnimationComplete();
    }, lastDelay);
    return () => clearTimeout(timer);
  }, [isVisible, units.length, delay, durationMs, onLetterAnimationComplete]);

  const fromOpacity = resolvedFrom.opacity ?? 0;
  const toOpacity = resolvedTo.opacity ?? 1;
  const fromTransform = buildTransform(resolvedFrom);
  const toTransform = buildTransform(resolvedTo);
  const fromFilter = resolvedFrom.filter;
  const toFilter = resolvedTo.filter;

  return (
    <span
      ref={containerRef}
      className={className}
      aria-label={text}
      style={{ textAlign, display: 'inline', wordWrap: 'break-word' }}
    >
      {units.map((unit, i) => {
        const isSpace = unit === '';
        const displayUnit =
          resolvedSplitType === 'words'
            ? i < units.length - 1
              ? unit + '\u00A0'
              : unit
            : unit === ' '
              ? '\u00A0'
              : unit;

        const transitionProps: string[] = [
          `opacity ${durationMs}ms ${easingCss} ${i * delay}ms`,
          `transform ${durationMs}ms ${easingCss} ${i * delay}ms`,
        ];
        if (fromFilter || toFilter) {
          transitionProps.push(`filter ${durationMs}ms ${easingCss} ${i * delay}ms`);
        }

        return (
          <span
            key={i}
            className="inline-block"
            style={resolvedSplitType === 'chars' ? { overflow: 'hidden' } : { whiteSpace: 'pre' }}
          >
            <span
              className="inline-block"
              style={{
                opacity: isVisible ? toOpacity : fromOpacity,
                transform: isVisible ? toTransform : fromTransform,
                filter: fromFilter || toFilter
                  ? isVisible ? (toFilter ?? 'none') : (fromFilter ?? 'none')
                  : undefined,
                transition: isVisible ? transitionProps.join(', ') : 'none',
                willChange: 'transform, opacity',
                whiteSpace: isSpace ? 'pre' : undefined,
              }}
            >
              {displayUnit}
            </span>
          </span>
        );
      })}
    </span>
  );
}
