'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { getEmotionMeta, formatPercent } from '@/lib/emotions';
import ProbabilityChart from './ProbabilityChart';
import styles from './EmotionResult.module.css';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function EmotionResult({ result }) {
  const rootRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!result) return;

    const offset = CIRCUMFERENCE * (1 - result.confidence);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
      gsap.fromTo(
        ringRef.current,
        { strokeDashoffset: CIRCUMFERENCE },
        { strokeDashoffset: offset, duration: 1.1, ease: 'power2.out', delay: 0.15 }
      );
      gsap.fromTo(
        '[data-emoji]',
        { scale: 0, rotate: -20 },
        { scale: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.6)', delay: 0.3 }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [result]);

  if (!result) return null;

  const meta = getEmotionMeta(result.predicted_emotion);

  return (
    <div ref={rootRef} className={`${styles.card} glass`}>
      <div className={styles.top}>
        <div className={styles.dialWrap}>
          <svg viewBox="0 0 130 130" className={styles.dial}>
            <circle cx="65" cy="65" r={RADIUS} className={styles.track} />
            <circle
              ref={ringRef}
              cx="65"
              cy="65"
              r={RADIUS}
              className={styles.ring}
              style={{
                stroke: meta.color,
                filter: `drop-shadow(0 0 6px ${meta.glow})`,
                strokeDasharray: CIRCUMFERENCE,
              }}
            />
          </svg>
          <div className={styles.dialCenter}>
            <span data-emoji className={styles.dialEmoji}>
              {meta.emoji}
            </span>
          </div>
        </div>

        <div className={styles.summary}>
          <span className={styles.detectedLabel}>Detected Emotion</span>
          <h3 className={styles.emotionName}>{meta.label}</h3>
          <div className={styles.confidenceRow}>
            <span className={styles.confidenceLabel}>Confidence</span>
            <span className={styles.confidenceValue} style={{ color: meta.color }}>
              {formatPercent(result.confidence)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.divider} />

      <ProbabilityChart probabilities={result.all_probabilities} predictedEmotion={result.predicted_emotion} />
    </div>
  );
}
