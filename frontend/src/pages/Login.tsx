import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login: React.FC = () => {
  const { signUpWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);
      await signUpWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">My Journal</h1>
        <p className="login-subtitle">Track. Understand. Grow.</p>

        <div className="login-content">
          <p className="login-description">
            Sign up or log in with Google to start logging your athletic journey
          </p>

          <button
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="google-button"
          >
            {loading ? 'Signing up...' : '🔗 Sign up with Google'}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;