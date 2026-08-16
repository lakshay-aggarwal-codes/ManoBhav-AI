import './globals.css';

export const metadata = {
  title: 'Manobhav AI — Understand the Emotion Behind Your Words',
  description:
    'Manobhav AI uses a deep-learning BiGRU model to analyze the emotional tone of your text — joy, sadness, fear, surprise, love, and anger.',
  metadataBase: new URL('https://manobhav-ai.vercel.app'),
  openGraph: {
    title: 'Manobhav AI',
    description: 'Understand the emotion behind your words, powered by NLP and deep learning.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
