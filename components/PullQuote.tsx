'use client';

import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function PullQuote() {
  return (
    <section aria-label="Motto" className="px-6 py-32 min-h-screen flex flex-col justify-center snap-start">
      {/* Optional subtle rule */}
      <div className="mx-auto mb-16 h-px w-[120px] bg-border" />

      <motion.blockquote
        className="mx-auto max-w-[800px] text-center font-display text-[clamp(1.5rem,4vw,2.25rem)] italic leading-[1.4] text-text-primary"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
      >
        &ldquo;Think it, build it, check it, ship it —
        <br className="hidden sm:block" />
        dream team never slippin&rsquo;.&rdquo;
      </motion.blockquote>

      <motion.p
        className="mt-6 text-center text-sm text-text-muted"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
      >
        — The DreamTeam Motto
      </motion.p>

      <div className="mx-auto mt-16 h-px w-[120px] bg-border" />
    </section>
  );
}
