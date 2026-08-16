 
export const EMOTIONS = {
  sadness: { label: 'Sadness', emoji: '😢', color: '#6C8CFF', glow: 'rgba(108,140,255,0.45)' },
  joy: { label: 'Joy', emoji: '😊', color: '#FFC857', glow: 'rgba(255,200,87,0.45)' },
  fear: { label: 'Fear', emoji: '😨', color: '#A78BFA', glow: 'rgba(167,139,250,0.45)' },
  surprise: { label: 'Surprise', emoji: '😲', color: '#38D9C9', glow: 'rgba(56,217,201,0.45)' },
  love: { label: 'Love', emoji: '❤️', color: '#FF6B9D', glow: 'rgba(255,107,157,0.45)' },
  anger: { label: 'Anger', emoji: '😡', color: '#FF6B4A', glow: 'rgba(255,107,74,0.45)' },
};

export const EMOTION_ORDER = ['joy', 'love', 'surprise', 'sadness', 'fear', 'anger'];

export function getEmotionMeta(key) {
  return EMOTIONS[key] || { label: key, emoji: '❔', color: '#8A8FA3', glow: 'rgba(138,143,163,0.3)' };
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}
