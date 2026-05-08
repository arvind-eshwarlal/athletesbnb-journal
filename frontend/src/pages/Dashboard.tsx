import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { VoiceInput } from '../components/VoiceInput';
import { EntryList } from '../components/EntryList';
import { WeeklySummary } from '../components/WeeklySummary';
import { BottomSheet } from '../components/BottomSheet';
import { Toast } from '../components/Toast';

interface Entry {
  id: string;
  session_type: string;
  voice_transcript: string;
  intensity: number;
  created_at: string;
  insights?: Array<{ insight_text: string }>;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEntrySheet, setShowNewEntrySheet] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Fetch entries on mount
  useEffect(() => {
    if (user?.id) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/journal/entries/${user?.id}`
      );

      const sortedEntries = response.data.entries.sort(
        (a: Entry, b: Entry) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setEntries(sortedEntries);
    } catch (error) {
      console.error('Error fetching entries:', error);
      showToast('Failed to load entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEntryAdded = (newEntry: Entry) => {
    setEntries([newEntry, ...entries]);
    setShowNewEntrySheet(false);
    showToast('Entry saved', 'success');
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setShowNewEntrySheet(true);
  };

  const handleEditClose = () => {
    setEditingEntry(null);
    setShowNewEntrySheet(false);
    // Refresh to get updated entry
    fetchEntries();
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Logo - Top Right */}
      <div style={styles.logoContainer}>
        <div style={styles.logo}>.rlxed</div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Journal</h1>
          <p style={styles.subtitle}>
            {user?.sport} • {user?.level}
          </p>
        </div>
      </div>

      {/* New Entry Button */}
      <button
        onClick={() => {
          setEditingEntry(null);
          setShowNewEntrySheet(true);
        }}
        style={styles.newEntryButton}
      >
        + New Entry
      </button>

      {/* Bottom Sheet for New/Edit Entry */}
      <BottomSheet
        isOpen={showNewEntrySheet}
        onClose={editingEntry ? handleEditClose : () => setShowNewEntrySheet(false)}
        title={editingEntry ? 'Edit Entry' : 'Log Your Session'}
        height="full"
      >
        <VoiceInput
          sport={user?.sport || ''}
          level={user?.level || ''}
          userId={user?.id || ''}
          onEntryAdded={handleEntryAdded}
          onClose={editingEntry ? handleEditClose : () => setShowNewEntrySheet(false)}
          editingEntry={editingEntry}
        />
      </BottomSheet>

      {/* Entries List */}
      <EntryList entries={entries} onEditEntry={handleEditEntry} />

      {/* Weekly Summary */}
      {user?.id && <WeeklySummary userId={user.id} />}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: 'var(--space-lg)',
    backgroundColor: 'var(--color-off-white)',
    minHeight: '100vh',
    position: 'relative' as const
  },
  logoContainer: {
    position: 'absolute' as const,
    top: '12px',
    right: 'var(--space-lg)',
    zIndex: 10
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    fontFamily: 'Quicksand, sans-serif',
    color: 'var(--color-mid-gray)',
    letterSpacing: '0.5px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '300px'
  },
  loadingText: {
    fontSize: 'var(--font-size-base)',
    color: 'var(--color-mid-gray)',
    textAlign: 'center' as const
  },
  header: {
    marginBottom: 'var(--space-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  title: {
    fontSize: 'var(--font-size-4xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    margin: 0,
    marginBottom: '2px',
    color: 'var(--color-black)'
  },
  subtitle: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-mid-gray)',
    margin: 0
  },
  newEntryButton: {
    width: '100%',
    padding: 'var(--space-md)',
    backgroundColor: 'var(--color-black)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-lg)',
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    cursor: 'pointer',
    marginBottom: 'var(--space-xl)',
    transition: 'all var(--transition-normal)',
    ':hover': {
      backgroundColor: 'var(--color-dark-gray)'
    }
  }
};
