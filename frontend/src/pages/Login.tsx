import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>My Journal</h1>
        <p style={styles.subtitle}>Track. Understand. Grow.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div style={styles.toggle}>
          <span>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={styles.toggleButton}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    padding: '12px',
  } as const,
  card: {
    backgroundColor: 'white',
    padding: '28px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '420px',
    width: '100%',
  } as const,
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1a202c',
    margin: '0 0 2px 0',
  } as const,
  subtitle: {
    fontSize: '12px',
    color: '#666',
    margin: '2px 0 18px 0',
  } as const,
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as const,
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  } as const,
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
  } as const,
  input: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
  } as const,
  button: {
    padding: '9px',
    backgroundColor: '#1a202c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '6px',
  } as const,
  error: {
    color: '#d32f2f',
    fontSize: '12px',
    padding: '8px',
    backgroundColor: '#ffebee',
    borderRadius: '4px',
  } as const,
  toggle: {
    marginTop: '12px',
    fontSize: '12px',
    textAlign: 'center' as const,
    color: '#666',
  } as const,
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#1a202c',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginLeft: '4px',
  } as const,
};