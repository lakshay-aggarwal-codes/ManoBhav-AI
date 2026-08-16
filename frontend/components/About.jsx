'use client';

import { useEffect, useRef } from 'react';
import gsap from '@/lib/gsapConfig';
import { EMOTION_ORDER, getEmotionMeta } from '@/lib/emotions';
import styles from './About.module.css';

export default function About() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current.querySelectorAll('[data-about]'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={rootRef} className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div data-about>
          <span className="eyebrow">About the Project</span>
          <h2 className={styles.title}>What is Manobhav AI?</h2>
          <p className={styles.body}>
            Manobhav AI is an NLP-based emotion classification system designed to understand
            the emotional tone of written text. It takes a sentence as input and returns the
            emotion it most likely expresses, along with a confidence score.
          </p>
          <p className={styles.body}>
            "Manobhav" comes from the Hindi words for mind (मन) and feeling (भाव) — the idea of
            reading the feeling behind a thought.
          </p>
        </div>

        <div data-about className={`${styles.card} glass`}>
          <span className={styles.cardLabel}>Supported emotions</span>
          <div className={styles.pillGrid}>
            {EMOTION_ORDER.map((key) => {
              const meta = getEmotionMeta(key);
              return (
                <div key={key} className={styles.pill}>
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
