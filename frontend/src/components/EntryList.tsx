import React, { useState, useEffect } from 'react';

interface Entry {
  id: string;
  session_type: string;
  voice_transcript: string;
  intensity: number;
  created_at: string;
  insights?: Array<{ insight_text: string }>;
}

interface EntryListProps {
  entries: Entry[];
  onEditEntry: (entry: Entry) => void;
}

export const EntryList: React.FC<EntryListProps> = ({ entries, onEditEntry }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Set newest entry as expanded by default
  useEffect(() => {
    if (entries.length > 0) {
      setExpandedId(entries[0].id);
    }
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div style={styles.emptyState}>
        <p style={styles.emptyText}>No entries yet. Log your first session!</p>
      </div>
    );
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Logs</h2>
      {entries.map((entry, index) => {
        const isExpanded = expandedId === entry.id;
        const isNewest = index === 0;
        const hasInsight = entry.insights && entry.insights.length > 0;

        return (
          <div
            key={entry.id}
            style={{
              ...styles.card,
              ...(isNewest && styles.cardNewest)
            }}
          >
            {/* Card Header - Always visible */}
            <div
              style={styles.cardHeader}
              onClick={() => toggleExpand(entry.id)}
              role="button"
              tabIndex={0}
            >
              <div>
                <p style={styles.date}>
                  {new Date(entry.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
                <p style={styles.type}>{entry.session_type}</p>
              </div>
              <div style={styles.headerRight}>
                <div style={styles.intensity}>
                  Intensity: {entry.intensity}/10
                </div>
                <div style={styles.expandIcon}>
                  {isExpanded ? '▼' : '▶'}
                </div>
              </div>
            </div>

            {/* Card Body - Collapsible */}
            {isExpanded && (
              <>
                {/* Transcript */}
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Session Notes</h3>
                  <p style={styles.transcript}>{entry.voice_transcript}</p>
                </div>

                {/* Insight */}
                {hasInsight && entry.insights && entry.insights[0] && (
                  <div style={styles.insightSection}>
                    <h3 style={styles.sectionTitle}>💡 Coaching Insight</h3>
                    <p style={styles.insightText}>{entry.insights[0].insight_text}</p>
                    <p style={styles.insightDate}>
                      From {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                  <button
                    onClick={() => onEditEntry(entry)}
                    style={styles.editButton}
                  >
                    ✏️ Edit Entry
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: {
    marginTop: 'var(--space-lg)'
  },
  heading: {
    fontSize: 'var(--font-size-2xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    marginBottom: 'var(--space-lg)',
    color: 'var(--color-black)'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: 'var(--space-2xl) var(--space-lg)',
    backgroundColor: 'var(--color-off-white)',
    borderRadius: 'var(--radius-lg)',
    border: '1px dashed var(--color-light-gray)'
  },
  emptyText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-mid-gray)',
    margin: 0
  },
  card: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-light-gray)',
    borderRadius: 'var(--radius-lg)',
    marginBottom: 'var(--space-md)',
    overflow: 'hidden',
    transition: 'all var(--transition-normal)',
    boxShadow: 'var(--shadow-sm)'
  },
  cardNewest: {
    borderColor: 'var(--color-black)',
    boxShadow: 'var(--shadow-md)',
    backgroundColor: 'var(--color-white)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--space-md)',
    cursor: 'pointer',
    userSelect: 'none' as const,
    transition: 'background-color var(--transition-fast)',
    ':hover': {
      backgroundColor: 'var(--color-off-white)'
    }
  },
  date: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-mid-gray)',
    margin: 0
  },
  type: {
    fontSize: 'var(--font-size-base)',
    fontWeight: 'var(--font-weight-bold)',
    fontFamily: 'var(--font-heading)',
    color: 'var(--color-black)',
    margin: 'var(--space-xs) 0 0 0'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)'
  },
  intensity: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-dark-gray)',
    backgroundColor: 'var(--color-off-white)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-sm)',
    whiteSpace: 'nowrap' as const
  },
  expandIcon: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-mid-gray)',
    minWidth: '20px',
    textAlign: 'center' as const,
    transition: 'transform var(--transition-normal)'
  },
  section: {
    padding: 'var(--space-md)',
    borderTop: '1px solid var(--color-light-gray)'
  },
  sectionTitle: {
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    color: 'var(--color-dark-gray)',
    margin: '0 0 var(--space-sm) 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  transcript: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-black)',
    margin: 0,
    lineHeight: 'var(--line-height-normal)'
  },
  insightSection: {
    padding: 'var(--space-md)',
    backgroundColor: 'var(--color-light-gray)',
    borderTop: '1px solid var(--color-light-gray)',
    borderRadius: '0 0 var(--radius-lg) var(--radius-lg)'
  },
  insightText: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-black)',
    margin: '0 0 var(--space-sm) 0',
    lineHeight: 'var(--line-height-normal)'
  },
  insightDate: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-mid-gray)',
    margin: 0,
    fontStyle: 'italic'
  },
  actionButtons: {
    display: 'flex',
    gap: 'var(--space-sm)',
    padding: 'var(--space-md)',
    borderTop: '1px solid var(--color-light-gray)',
    flexWrap: 'wrap' as const
  },
  editButton: {
    flex: 1,
    minWidth: '120px',
    padding: 'var(--space-sm) var(--space-md)',
    backgroundColor: 'var(--color-off-white)',
    color: 'var(--color-black)',
    border: '1px solid var(--color-light-gray)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)'
  }
};
