'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from '@/lib/gsapConfig';
import { predictEmotion, ApiError } from '@/lib/api';
import EmotionResult from './EmotionResult';
import styles from './EmotionAnalyzer.module.css';

const MAX_LENGTH = 2000;
const EXAMPLES = [
  'I just got the internship offer, I can barely sit still.',
  "I don't know why but I can't stop thinking about what happened.",
  'The results came out of nowhere, I genuinely did not expect that.',
];

export default function EmotionAnalyzer() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const cardRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 82%' },
      });
    }, cardRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (status === 'loading' && loaderRef.current) {
      gsap.fromTo(
        loaderRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
    }
  }, [status]);

  async function handleAnalyze() {
    if (!text.trim() || status === 'loading') return;
    setStatus('loading');
    setError('');

    try {
      const data = await predictEmotion(text);
      setResult(data);
      setStatus('success');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setStatus('error');
    }
  }

  function handleExample(example) {
    setText(example);
  }

  const remaining = MAX_LENGTH - text.length;
  const isOverLimit = remaining < 0;

  return (
    <section id="analyze" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="eyebrow">Emotion Intelligence Engine</span>
          <h2 className={styles.title}>Analyze the emotion in any piece of text</h2>
          <p className={styles.subtitle}>
            Type a sentence, a message, or a journal entry. Manobhav AI reads the emotional
            tone and shows you exactly how confident it is.
          </p>
        </div>

        <div ref={cardRef} className={`${styles.card} glass`}>
          <div className={styles.inputWrap}>
            <textarea
              className={styles.textarea}
              placeholder="Type your thoughts here..."
              value={text}
              maxLength={MAX_LENGTH + 200}
              onChange={(e) => setText(e.target.value)}
              rows={5}
            />
            <div className={styles.inputFooter}>
              <span className={`${styles.counter} ${isOverLimit ? styles.counterOver : ''}`}>
                {text.length} / {MAX_LENGTH}
              </span>
              <div className={styles.examples}>
                {EXAMPLES.map((ex) => (
                  <button key={ex} type="button" className={styles.exampleChip} onClick={() => handleExample(ex)}>
                    {ex.length > 34 ? `${ex.slice(0, 34)}…` : ex}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`btn btn-primary ${styles.analyzeBtn}`}
            onClick={handleAnalyze}
            disabled={!text.trim() || status === 'loading' || isOverLimit}
          >
            {status === 'loading' ? 'Analyzing…' : 'Analyze Emotion'}
          </button>

          {status === 'loading' && (
            <div ref={loaderRef} className={styles.loader}>
              <span className={styles.loaderDot} />
              <span className={styles.loaderDot} />
              <span className={styles.loaderDot} />
              <span className={styles.loaderText}>Reading the emotional tone…</span>
            </div>
          )}

          {status === 'error' && (
            <div className={styles.errorBox} role="alert">
              <strong>Couldn't analyze that.</strong> {error}
            </div>
          )}
        </div>

        {status === 'success' && result && (
          <div className={styles.resultWrap}>
            <EmotionResult result={result} />
          </div>
        )}
      </div>
    </section>
  );
}
