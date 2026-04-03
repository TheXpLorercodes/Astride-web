import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Sector Uncharted</h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2rem' }}>
        The cosmic coordinates you requested do not exist in our database. It may be a newly formed black hole, or simply a broken link.
      </p>
      <Link href="/" className="btn-primary">
        Return to Home System
      </Link>
    </div>
  );
}
