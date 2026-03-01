'use client';

import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

// Minimalist, consistent SVG icons — same stroke weight, same style
const icons = {
  Think: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="24" cy="20" r="10" />
      <path d="M19 30v2a5 5 0 0010 0v-2" />
      <line x1="24" y1="10" x2="24" y2="6" />
      <line x1="14.2" y1="14.2" x2="11.4" y2="11.4" />
      <line x1="33.8" y1="14.2" x2="36.6" y2="11.4" />
      <line x1="20" y1="20" x2="24" y2="24" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Build: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <rect x="8" y="32" width="32" height="8" rx="1" />
      <rect x="14" y="24" width="20" height="8" rx="1" />
      <rect x="20" y="16" width="8" height="8" rx="1" />
      <line x1="24" y1="8" x2="24" y2="16" />
      <polyline points="20,12 24,8 28,12" />
    </svg>
  ),
  Check: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <circle cx="24" cy="24" r="14" />
      <polyline points="16,24 21,30 32,18" />
    </svg>
  ),
  Ship: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 32c2.5 0 4-1.5 8-1.5s5.5 1.5 8 1.5 5.5-1.5 8-1.5 5.5 1.5 8 1.5" />
      <path d="M12 32V20l12-8 12 8v12" />
      <line x1="24" y1="12" x2="24" y2="32" />
      <line x1="16" y1="20" x2="32" y2="20" />
    </svg>
  ),
};

const pipelineSteps = [
  { label: 'Think', agent: 'Thinker', desc: 'Research, strategy, and planning before a single line of code.' },
  { label: 'Build', agent: 'Creator', desc: 'Code, design, and ship with precision and craft.' },
  { label: 'Check', agent: 'Gatekeeper', desc: 'QA review, security audit, and quality gate.' },
  { label: 'Ship',  agent: 'Admin',      desc: 'Deploy, announce, and close the loop.' },
];

export default function Pipeline() {
  return (
    <section aria-label="Pipeline" className="relative px-6 py-40 md:px-12 lg:px-16 overflow-hidden min-h-screen snap-start">
      {/* subtle HUD grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,150,80,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(180,150,80,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto max-w-[1200px]">
        {/* Section heading */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="mb-3 text-xs tracking-[0.3em] text-text-muted uppercase font-mono">
            PROTOCOL / HOW WE WORK
          </p>
          <h2 className="font-display text-[clamp(1.75rem,5vw,3rem)] font-normal text-text-primary">
            How We Work
          </h2>
        </motion.div>

        {/* Desktop: horizontal pipeline */}
        <div className="mt-20 hidden items-stretch justify-center gap-0 sm:flex">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease }}
            >
              {/* Card */}
              <div className="group relative flex w-[220px] flex-col items-center overflow-hidden rounded-xl border border-border bg-bg-card transition-all duration-300 hover:border-[#C49A1A]/60 hover:shadow-[0_0_32px_rgba(196,154,26,0.15)]">
                {/* Top accent bar */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C49A1A]/50 to-transparent" />

                {/* Step number */}
                <div className="absolute top-3 left-3 font-mono text-[10px] text-[#C49A1A]/50 tracking-widest">
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div
                  className="mt-10 mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-xl border border-[#C49A1A]/20 bg-[#C49A1A]/5 transition-colors duration-300 group-hover:border-[#C49A1A]/40 group-hover:bg-[#C49A1A]/10"
                  style={{ color: '#C49A1A' }}
                >
                  {icons[step.label as keyof typeof icons]}
                </div>

                {/* Label & agent */}
                <div className="mb-4 px-4 text-center">
                  <p className="text-base font-semibold text-text-primary tracking-wide">{step.label}</p>
                  <p className="mt-0.5 font-mono text-xs text-[#C49A1A]/70">{step.agent}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-text-muted">{step.desc}</p>
                </div>

                {/* Bottom accent */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C49A1A]/30 to-transparent" />
              </div>

              {/* Connector arrow */}
              {i < pipelineSteps.length - 1 && (
                <div className="relative flex w-12 shrink-0 items-center justify-center">
                  <div className="h-px w-full bg-gradient-to-r from-[#C49A1A]/40 to-[#C49A1A]/10" />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    className="absolute right-0 shrink-0 text-[#C49A1A]/60"
                    fill="currentColor"
                  >
                    <path d="M0 0 L10 5 L0 10 Z" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile: vertical stack */}
        <div className="mt-16 flex flex-col items-center gap-3 sm:hidden">
          {pipelineSteps.map((step, i) => (
            <motion.div
              key={step.label}
              className="w-full max-w-xs"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <div className="group flex items-center gap-4 overflow-hidden rounded-xl border border-border bg-bg-card px-5 py-4 transition-all duration-300 hover:border-[#C49A1A]/60">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[#C49A1A]/20 bg-[#C49A1A]/5"
                  style={{ color: '#C49A1A' }}
                >
                  {icons[step.label as keyof typeof icons]}
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[#C49A1A]/50 tracking-widest">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                  <p className="text-xs text-text-muted">{step.agent}</p>
                </div>
              </div>
              {i < pipelineSteps.length - 1 && (
                <div className="mx-auto my-1 h-3 w-px bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
