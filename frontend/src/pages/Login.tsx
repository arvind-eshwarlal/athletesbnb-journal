import { Logo } from '../components/Logo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '50px 20px', fontFamily: 'Ubuntu, sans-serif' }}>
      <Logo />

      <div style={{ maxWidth: '500px', margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
        {/* Headline */}
        <h1 style={{ fontFamily: 'Quicksand, sans-serif', fontSize: '38px', fontWeight: 'bold', lineHeight: '1.2', marginBottom: '12px', color: '#000' }}>
          {isSignUp ? 'Start Your Journey' : 'Welcome Back'}
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', marginBottom: '36px' }}>
          {isSignUp
            ? 'Create an account to start tracking your progress.'
            : 'Sign in to continue your training journey.'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#000' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '2px',
                fontFamily: 'Ubuntu, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: '#000' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '2px',
                fontFamily: 'Ubuntu, sans-serif',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{ backgroundColor: '#ffebee', color: '#d32f2f', padding: '12px', borderRadius: '2px', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading ? '#999' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Ubuntu, sans-serif',
              transition: 'background-color 0.2s',
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Link */}
        <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'Ubuntu, sans-serif',
              fontSize: '14px',
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#999', marginTop: '40px' }}>
        My Journal - Track. Learn. Grow.
      </footer>
    </div>
  );
}