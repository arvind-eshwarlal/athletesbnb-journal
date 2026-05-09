import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from '../store/authStore';

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

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  // Debug logging for OAuth errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const errorCode = params.get('error_code');
    const errorMsg = params.get('error_description');
    
    if (error) {
      console.log('OAuth Error:', { error, errorCode, errorMsg });
    }
  }, []);

  const [sport, setSport] = useState('');
  const [level, setLevel] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state: any) => state.setUser);

  const handleSubmit = async () => {
    if (!sport || !level || goals.length === 0) {
      alert('Please select sport, level, and at least one goal');
      return;
    }

    setLoading(true);

    try {
      const userId = uuidv4();
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/journal/preferences`, {
        athletesbnb_user_id: userId,
        sport,
        level,
        goals
      });

      setUser(response.data.user);
      onComplete();
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome To Your Journal</h1>
        <p style={styles.subtitle}>Track. Understand. Grow.</p>

        <div style={styles.formGroup}>
          <label style={styles.label}>Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            style={styles.select}
          >
            <option value="">Select sport...</option>
            {sports.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Level</label>
          <div style={styles.radioGroup}>
            {levels.map((l) => (
              <label key={l} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="level"
                  value={l}
                  checked={level === l}
                  onChange={(e) => setLevel(e.target.value)}
                />
                {l}
              </label>
            ))}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Primary focus?</label>
          <div style={styles.checkboxGroup}>
            {[
              { id: 'performance', label: 'Performance' },
              { id: 'competition', label: 'Competition' },
              { id: 'injury', label: 'Injury Comeback' }
            ].map((goal) => (
              <label key={goal.id} style={styles.checkboxLabel}>
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
                  style={{ cursor: 'pointer', marginRight: '4px' }}
                />
                {goal.label}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !sport || !level || goals.length === 0}
          style={{...styles.button, opacity: loading || !sport || !level || goals.length === 0 ? 0.5 : 1}}
        >
          {loading ? 'Setting up...' : 'Get Started'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    padding: '12px'
  },
  card: {
    backgroundColor: 'white',
    padding: '28px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    maxWidth: '420px',
    width: '100%'
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '2px',
    color: '#1a202c',
    margin: '0 0 2px 0'
  },
  subtitle: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '18px',
    margin: '2px 0 18px 0'
  },
  formGroup: {
    marginBottom: '14px'
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '5px',
    color: '#333'
  },
  select: {
    width: '100%',
    padding: '7px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    boxSizing: 'border-box' as const
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    cursor: 'pointer',
    gap: '5px'
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
    cursor: 'pointer',
    gap: '5px'
  },
  button: {
    width: '100%',
    padding: '9px',
    backgroundColor: '#1a202c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '6px'
  }
};