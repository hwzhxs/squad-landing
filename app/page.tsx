import Hero from '@/components/Hero';
import AgentsScroll from '@/components/AgentsScroll';
import PullQuote from '@/components/PullQuote';
import Pipeline from '@/components/Pipeline';
import Terminal from '@/components/Terminal';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <main id="main" className="h-screen overflow-y-scroll snap-y snap-mandatory">
        <Hero />
        <AgentsScroll />
        <PullQuote />
        <Pipeline />
        <Terminal />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
