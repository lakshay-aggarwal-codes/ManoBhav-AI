'use client';

import { useEffect, useRef } from 'react';
import gsap from '@/lib/gsapConfig';
import styles from './HowItWorks.module.css';

const STEPS = [
  {
    title: 'You write',
    desc: 'Type any sentence, message, or note — a few words or a full paragraph.',
  },
  {
    title: 'Text preprocessing',
    desc: 'The text is cleaned and normalized so the model reads it consistently.',
  },
  {
    title: 'Tokenization',
    desc: 'Words are converted into numerical tokens the model can understand.',
  },
  {
    title: 'BiGRU network',
    desc: 'A bidirectional GRU reads the sequence forward and backward to capture context.',
  },
  {
    title: 'Emotion prediction',
    desc: 'A softmax layer scores all six emotions and returns the most likely one.',
  },
];

export default function HowItWorks() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-step]', {
        opacity: 0,
        x: -24,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 75%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={rootRef} className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">The Pipeline</span>
          <h2 className={styles.title}>How Manobhav AI reads emotion</h2>
          <p className={styles.subtitle}>
            From raw text to a predicted feeling — five steps, all handled on the backend in
            under a second.
          </p>
        </div>

        <div className={styles.timeline}>
          {STEPS.map((step, i) => (
            <div key={step.title} data-step className={styles.step}>
              <div className={styles.stepMarker}>
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
