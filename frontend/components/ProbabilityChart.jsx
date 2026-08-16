'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EMOTION_ORDER, getEmotionMeta, formatPercent } from '@/lib/emotions';
import styles from './ProbabilityChart.module.css';

export default function ProbabilityChart({ probabilities, predictedEmotion }) {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!probabilities) return;
    const ctx = gsap.context(() => {
      gsap.set('[data-bar-fill]', { scaleX: 0 });
      gsap.set('[data-bar-row]', { opacity: 0, x: -12 });

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.to('[data-bar-row]', { opacity: 1, x: 0, duration: 0.4, stagger: 0.07 }).to(
        '[data-bar-fill]',
        { scaleX: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out', transformOrigin: 'left center' },
        '-=0.25'
      );
    }, rootRef);

    return () => ctx.revert();
  }, [probabilities]);

  if (!probabilities) return null;

  const ordered = EMOTION_ORDER.map((key) => ({ key, value: probabilities[key] ?? 0 })).sort(
    (a, b) => b.value - a.value
  );

  return (
    <div ref={rootRef} className={styles.chart}>
      {ordered.map(({ key, value }) => {
        const meta = getEmotionMeta(key);
        const isTop = key === predictedEmotion;
        return (
          <div key={key} data-bar-row className={`${styles.row} ${isTop ? styles.rowActive : ''}`}>
            <span className={styles.emoji}>{meta.emoji}</span>
            <span className={styles.label}>{meta.label}</span>
            <div className={styles.track}>
              <div
                data-bar-fill
                className={styles.fill}
                style={{ background: meta.color, boxShadow: `0 0 14px 0 ${meta.glow}`, width: `${value * 100}%` }}
              />
            </div>
            <span className={styles.value}>{formatPercent(value)}</span>
          </div>
        );
      })}
    </div>
  );
}
