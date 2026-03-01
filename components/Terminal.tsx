'use client';

import { motion } from 'framer-motion';
import { terminalContent } from '@/lib/agents';

const ease = [0.25, 0.1, 0.25, 1] as const;

function syntaxHighlight(line: string): React.ReactNode {
  if (line.startsWith('# ')) {
    return <span className="text-text-primary font-semibold">{line}</span>;
  }
  if (line.startsWith('## ')) {
    return <span className="text-text-primary">{line}</span>;
  }
  if (line.startsWith('- **')) {
    const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
    if (match) {
      return (
        <>
          <span className="text-text-muted">- </span>
          <span className="text-text-primary font-medium">{match[1]}</span>
          <span className="text-text-secondary">{match[2]}</span>
        </>
      );
    }
  }
  return <span className="text-text-secondary">{line}</span>;
}

export default function Terminal() {
  const lines = terminalContent.split('\n');

  return (
    <section aria-label="Under the Hood" className="px-6 py-40 md:px-12 lg:px-16 min-h-screen snap-start">
      <div className="mx-auto max-w-[1200px]">
        <motion.h2
          className="text-center font-display text-[clamp(1.75rem,5vw,3rem)] font-normal text-text-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          Under the Hood
        </motion.h2>

        <motion.div
          className="mx-auto mt-16 max-w-[640px] overflow-hidden rounded-xl border border-border bg-[#111111]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-2.5 w-2.5 rounded-full bg-text-muted/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-text-muted/20" />
            <div className="h-2.5 w-2.5 rounded-full bg-text-muted/20" />
            <span className="ml-3 font-mono text-xs text-text-muted">task-handoff.md</span>
          </div>

          {/* Content */}
          <div className="p-6 font-mono text-sm leading-[1.7]">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                {line === '' ? <br /> : syntaxHighlight(line)}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
