'use client';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import EmotionAnalyzer from '@/components/EmotionAnalyzer';
import HowItWorks from '@/components/HowItWorks';
import TechStack from '@/components/TechStack';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <EmotionAnalyzer />
        <HowItWorks />
        <TechStack />
        <About />
      </main>
      <Footer />
    </>
  );
}
