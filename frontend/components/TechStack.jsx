'use client';

import { useEffect, useRef } from 'react';
import gsap from '@/lib/gsapConfig';
import styles from './TechStack.module.css';

const LAYERS = [
  { name: 'NLP Preprocessing', desc: 'Lowercasing, cleaning, and normalizing raw input text.' },
  { name: 'Tokenization', desc: 'Mapping words to a fixed vocabulary of integer tokens.' },
  { name: 'Embedding Layer', desc: 'Turning tokens into dense vectors that capture meaning.' },
  { name: 'BiGRU', desc: 'A bidirectional gated recurrent network reading context both ways.' },
  { name: 'Softmax Classification', desc: 'Scoring all six emotions and selecting the top prediction.' },
];

export default function TechStack() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-layer]', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Under the Hood</span>
          <h2 className={styles.title}>Powered by Deep Learning</h2>
          <p className={styles.subtitle}>
            Manobhav AI's prediction pipeline runs entirely on a trained neural network — no
            keyword matching, no hardcoded rules.
          </p>
        </div>

        <div className={styles.layers}>
          {LAYERS.map((layer, i) => (
            <div key={layer.name} data-layer className={`${styles.layer} glass`}>
              <span className={styles.layerIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.layerName}>{layer.name}</h3>
              <p className={styles.layerDesc}>{layer.desc}</p>
            </div>
          ))}
        </div>

        <p className={styles.disclaimer}>
          Model accuracy varies with input length and phrasing — Manobhav AI gives its best
          estimate, along with the confidence behind it.
        </p>
      </div>
    </section>
  );
}
