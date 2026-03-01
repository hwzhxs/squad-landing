'use client';

import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function CTA() {
  return (
    <section aria-label="Call to action" className="px-6 py-32 min-h-screen flex flex-col justify-center snap-start">
      <div className="mx-auto max-w-[600px] text-center">
        <motion.h2
          className="font-display text-[clamp(1.75rem,5vw,2.5rem)] font-normal text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          Ready to build your dream team?
        </motion.h2>

        <motion.p
          className="mt-4 text-base text-text-secondary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          Open source. Self-hosted. Your agents, your rules.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease }}
        >
          <a
            href="https://github.com/openclaw/openclaw"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-text-primary px-8 py-4 text-[15px] font-medium text-bg-primary transition-all duration-200 hover:bg-white hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.2)]"
          >
            Get Started
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
