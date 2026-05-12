import { Logo } from '../components/Logo';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const sports = [
  'Tennis',
  'Swimming',
  'Basketball',
  'Gymnastics',
  'Track & Field',
  'Soccer',
  'Volleyball',
  'Badminton',
  'Squash',
  'Rowing',
  'Cycling',
  'Martial Arts'
];

const levels = ['Beginner', 'Competitive', 'Elite'];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sport, setSport] = useState('');
  const [level, setLevel] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!sport || !level || goals.length === 0) {
      setError('Please select sport, level, and at least one goal');
      return;
    }
  
    if (!user || !user.id) {
      setError('User not found. Please sign in again.');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/journal/preferences`, {
        athletesbnb_user_id: user.id,  // ← Use the correct field name
        sport,
        level,
        goals
      });
  
      // Navigate to dashboard after successful onboarding
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
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
          Welcome to My Journal
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#666', marginBottom: '36px' }}>
          Let's set up your profile so we can give you the most relevant insights.
        </p>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={{ marginBottom: '20px' }}>
          {/* Sport Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
              What sport do you compete in?
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
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
            >
              <option value="">Select a sport...</option>
              {sports.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Level Field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
              What's your competitive level?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {levels.map((l) => (
                <label key={l} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="radio"
                    name="level"
                    value={l}
                    checked={level === l}
                    onChange={(e) => setLevel(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>

          {/* Goals Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#000' }}>
              What's your primary focus?
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'performance', label: 'Improve Performance' },
                { id: 'competition', label: 'Prepare for Competitions' },
                { id: 'injury', label: 'Injury Recovery' }
              ].map((goal) => (
                <label key={goal.id} style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={goals.includes(goal.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setGoals([...goals, goal.id]);
                      } else {
                        setGoals(goals.filter(g => g !== goal.id));
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                  {goal.label}
                </label>
              ))}
            </div>
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
            disabled={loading || !sport || !level || goals.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: loading || !sport || !level || goals.length === 0 ? '#999' : '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '2px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading || !sport || !level || goals.length === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'Ubuntu, sans-serif',
            }}
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#999', marginTop: '40px' }}>
        © 2024 My Journal - Track. Learn. Grow.
      </footer>
    </div>
  );
};