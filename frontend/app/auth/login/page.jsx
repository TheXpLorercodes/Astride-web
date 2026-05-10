'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { persistDashboardAuthSession, normalizeDashboardRedirectTarget } from '../../../lib/dashboardAuthClient';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = normalizeDashboardRedirectTarget(searchParams.get('redirectTo'));
  const signupHref = `/auth/signup?redirectTo=${encodeURIComponent(redirectTarget)}`;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const accessToken = data?.session?.access_token;
      const sessionResult = await persistDashboardAuthSession(accessToken);

      if (!sessionResult.ok) {
        await supabase.auth.signOut();
        setError(sessionResult.error || 'Unable to secure the dashboard session.');
        setLoading(false);
        return;
      }

      router.replace(redirectTarget);
      router.refresh();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Continue your journey through the cosmos</p>
        
        {error && <div className="error-message">{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              className="auth-input"
              type="email" 
              placeholder="astronaut@cosmoverse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
              className="auth-input"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Initiating...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
            Don&apos;t have an account?{' '}
          <Link href={signupHref} className="auth-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}
