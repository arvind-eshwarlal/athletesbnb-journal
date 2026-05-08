import React, { useState, useEffect } from 'react';
import axios from 'axios';



interface SummaryData {
  sessionCount: number;
  dateRange: {
    start: string;
    end: string;
  };
  insights: Array<{ insight_text: string; session_type: string }>;
  weeklySynthesis: string;
}

interface WeeklySummaryProps {
  userId: string;
}

export const WeeklySummary: React.FC<WeeklySummaryProps> = ({ userId }) => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklySummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/journal/summary/${userId}`
        );

        setSummary(response.data.summary);
      } catch (err: any) {
        console.error('Error fetching weekly summary:', err);
        setError('Failed to load weekly summary');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWeeklySummary();
    }
  }, [userId]);

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Weekly Summary</h2>
        <p style={styles.loadingText}>Loading your summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Weekly Summary</h2>
        <p style={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!summary || summary.sessionCount === 0) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Weekly Summary</h2>
        <p style={styles.emptyText}>No sessions this week. Start logging to see your summary!</p>
      </div>
    );
  }

  const startDate = new Date(summary.dateRange.start);
  const endDate = new Date(summary.dateRange.end);
  const dateRangeStr = `${startDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })} - ${endDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })}`;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Weekly Summary</h2>

      {/* Stats Bar */}
      <div style={styles.statsBar}>
        <div style={styles.statItem}>
          <p style={styles.statLabel}>Sessions</p>
          <p style={styles.statValue}>{summary.sessionCount}</p>
        </div>
        <div style={styles.statDivider} />
        <div style={styles.statItem}>
          <p style={styles.statLabel}>Period</p>
          <p style={{...styles.statValue, fontSize: 'var(--font-size-xs)'}}>
            {dateRangeStr}
          </p>
        </div>
      </div>

      {/* All Insights */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Your Insights</h3>
        <div style={styles.insightsList}>
          {summary.insights.map((item, index) => (
            <div key={index} style={styles.insightItem}>
              <div style={styles.insightMeta}>
                <span style={styles.sessionType}>{item.session_type}</span>
              </div>
              <p style={styles.insightContent}>{item.insight_text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Synthesis */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Weekly Synthesis</h3>
        <div style={styles.synthesisBox}>
          <p style={styles.synthesisText}>{summary.weeklySynthesis}</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: 'var(--space-2xl)',
    paddingTop: 'var(--space-lg)',
    borderTop: '1px solid var(--color-light-gray)'
  },
  heading: {
    fontSize: 'var(--font-size-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    marginBottom: 'var(--space-lg)',
    color: 'var(--color-black)',
    margin: '0 0 var(--space-lg) 0'
  },
  loadingText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-mid-gray)',
    textAlign: 'center' as const
  },
  errorText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-dark-gray)',
    textAlign: 'center' as const,
    backgroundColor: 'var(--color-off-white)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    margin: 0
  },
  emptyText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-mid-gray)',
    textAlign: 'center' as const,
    padding: 'var(--space-lg)',
    backgroundColor: 'var(--color-off-white)',
    borderRadius: 'var(--radius-md)',
    margin: 0
  },
  statsBar: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'var(--color-off-white)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 'var(--space-lg)',
    border: '1px solid var(--color-light-gray)'
  },
  statItem: {
    textAlign: 'center' as const,
    flex: 1
  },
  statLabel: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-mid-gray)',
    margin: '0 0 var(--space-xs) 0',
    fontWeight: 'var(--font-weight-medium)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  statValue: {
    fontSize: 'var(--font-size-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-black)',
    margin: 0
  },
  statDivider: {
    width: '1px',
    height: '40px',
    backgroundColor: 'var(--color-light-gray)',
    margin: '0 var(--space-md)'
  },
  section: {
    marginBottom: 'var(--space-lg)'
  },
  sectionTitle: {
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-dark-gray)',
    margin: '0 0 var(--space-md) 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  insightsList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-md)'
  },
  insightItem: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-light-gray)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-sm)'
  },
  insightMeta: {
    marginBottom: 'var(--space-sm)'
  },
  sessionType: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-mid-gray)',
    backgroundColor: 'var(--color-off-white)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    display: 'inline-block'
  },
  insightContent: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-black)',
    lineHeight: 'var(--line-height-normal)',
    margin: 0
  },
  synthesisBox: {
    backgroundColor: 'var(--color-light-gray)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-light-gray)'
  },
  synthesisText: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-black)',
    lineHeight: 'var(--line-height-normal)',
    margin: 0
  }
};
