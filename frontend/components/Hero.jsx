'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import styles from './Hero.module.css';

// The Three.js canvas is client-only and non-critical, so it's loaded
// lazily and never blocks the text entrance animation.
const EmotionSphere = dynamic(() => import('./EmotionSphere'), { ssr: false });

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="eyebrow"]', { opacity: 0, y: 16, duration: 0.6 })
        .from('[data-hero="title-line"]', { opacity: 0, y: 28, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .from('[data-hero="sub"]', { opacity: 0, y: 20, duration: 0.7 }, '-=0.4')
        .from('[data-hero="cta"]', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.35')
        .from('[data-hero="visual"]', { opacity: 0, scale: 0.92, duration: 1 }, '-=0.7')
        .from('[data-hero="stat"]', { opacity: 0, y: 14, duration: 0.5, stagger: 0.1 }, '-=0.5');
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={rootRef} className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span data-hero="eyebrow" className="eyebrow">
            <span className={styles.pulse} /> NLP · Deep Learning · Emotion Intelligence
          </span>

          <h1 className={styles.title}>
            <span data-hero="title-line" className={styles.line}>
              Understand the
            </span>
            <span data-hero="title-line" className={`${styles.line} gradient-text`}>
              Emotion Behind
            </span>
            <span data-hero="title-line" className={styles.line}>
              Your Words.
            </span>
          </h1>

          <p data-hero="sub" className={styles.subtitle}>
            Manobhav AI uses deep learning and NLP to understand the emotional tone of your
            text — trained on a BiGRU network that reads sentiment the way people feel it.
          </p>

          <div className={styles.ctaRow}>
            <a data-hero="cta" href="#analyze" className="btn btn-primary">
              Analyze Emotion
            </a>
            <a data-hero="cta" href="#how-it-works" className="btn btn-secondary">
              Explore How It Works
            </a>
          </div>

          <div className={styles.stats}>
            <div data-hero="stat" className={styles.stat}>
              <span className={styles.statNum}>6</span>
              <span className={styles.statLabel}>Emotion classes</span>
            </div>
            <div data-hero="stat" className={styles.stat}>
              <span className={styles.statNum}>BiGRU</span>
              <span className={styles.statLabel}>Sequence model</span>
            </div>
            <div data-hero="stat" className={styles.stat}>
              <span className={styles.statNum}>&lt;1s</span>
              <span className={styles.statLabel}>Typical response</span>
            </div>
          </div>
        </div>

        <div data-hero="visual" className={styles.visual}>
          <EmotionSphere />
        </div>
      </div>
    </section>
  );
}
