import './globals.css';
import Navbar from '../components/Navbar/Navbar';
import Assistant from '../components/AICosmicAssistant/Assistant';

export const metadata = {
  title: { default: 'CosmoVerse — Explore the Infinite Cosmos', template: '%s | CosmoVerse' },
  description: 'An immersive space encyclopedia. Explore planets, stars, galaxies, the ISS, space news, and upcoming rocket launches.',
  keywords: ['space', 'astronomy', 'planets', 'NASA', 'ISS', 'galaxies', 'stars', 'cosmos'],
  openGraph: {
    title: 'CosmoVerse — Explore the Infinite Cosmos',
    description: 'An immersive space encyclopedia. Explore planets, stars, galaxies, the ISS tracker, space news, and rocket launches.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body suppressHydrationWarning>
        <div className="stars-background" aria-hidden="true" />
        <Navbar />
        <main className="content">
          {children}
        </main>
        <Assistant />
      </body>
    </html>
  );
}
