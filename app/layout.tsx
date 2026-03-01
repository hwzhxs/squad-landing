import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Cursor from '@/components/Cursor';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DreamTeam — Four Agents. One Machine.',
  description: 'An AI dream team that thinks, builds, reviews, and ships — on a single VM.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <noscript>
          <style>{`* { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
