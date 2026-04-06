import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import AppChrome from '../components/AppChrome/AppChrome';

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
        <AuthProvider>
          <AppChrome>{children}</AppChrome>
        </AuthProvider>
      </body>
    </html>
  );
}
