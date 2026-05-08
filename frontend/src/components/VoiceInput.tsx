import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Entry {
  id: string;
  session_type: string;
  voice_transcript: string;
  intensity: number;
  created_at: string;
  insights?: Array<{ insight_text: string }>;
}

interface VoiceInputProps {
  sport: string;
  level: string;
  userId: string;
  onEntryAdded: (entry: any) => void;
  onClose: () => void;
  editingEntry?: Entry | null;
}

const sessionTypes = [
  'Skill Development',
  'Strength/Conditioning',
  'Recovery',
  'Mental Training',
  'Competition',
  'Off-Day'
];

const prompts: { [key: string]: string } = {
  'Skill Development': 'Tell us how your practice went. What worked? What felt off? Anything you are focusing on next?',
  'Strength/Conditioning': 'What did you work on? How did it feel? Any parts of your body that are sore or tired?',
  'Recovery': 'How are you feeling right now? What recovery did you do? Any areas still needing attention?',
  'Mental Training': 'What mental work did you do today? What shifted for you? How confident are you feeling right now?',
  'Competition': 'How did the competition go? What did you execute well? What\'s your biggest takeaway?',
  'Off-Day': 'How are you feeling today? What did you do to recharge? Anything on your mind?'
};

export const VoiceInput: React.FC<VoiceInputProps> = ({
  sport,
  level,
  userId,
  onEntryAdded,
  onClose,
  editingEntry
}) => {
  const isEditing = !!editingEntry;
  const [sessionType, setSessionType] = useState(editingEntry?.session_type || 'Skill Development');
  const [transcript, setTranscript] = useState(editingEntry?.voice_transcript || '');
  const [intensity, setIntensity] = useState(editingEntry?.intensity || 5);
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState(editingEntry?.insights?.[0]?.insight_text || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [transcript]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      alert('Please record or type something');
      return;
    }

    setLoading(true);

    try {
      if (isEditing) {
        // Update existing entry
        await axios.put(
          `${process.env.REACT_APP_API_URL}/journal/entries/${editingEntry!.id}`,
          {
            session_type: sessionType,
            voice_transcript: transcript,
            intensity
          }
        );
        console.log('✅ Entry updated successfully');
      } else {
        // Create new entry
        const entryResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/journal/entries`,
          {
            user_id: userId,
            session_type: sessionType,
            voice_transcript: transcript,
            intensity
          }
        );

        const entry = entryResponse.data.entry;

        // Generate insight for new entries only
        try {
          const insightResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/journal/insights`,
            {
              entry_id: entry.id,
              voice_transcript: transcript,
              session_type: sessionType,
              intensity,
              level,
              sport
            }
          );

          if (insightResponse.data?.insight?.insight_text) {
            const insightText = insightResponse.data.insight.insight_text;
            setInsight(insightText);
            entry.insights = [{ insight_text: insightText }];
          }
        } catch (insightError: any) {
          console.error('❌ Error generating insight:', insightError?.response?.data || insightError.message);
        }

        onEntryAdded(entry);
      }

      // Reset and close
      setTranscript('');
      setIntensity(5);
      setSessionType('Skill Development');
      setInsight('');
      onClose();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Session Type */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Session Type</label>
        <select
          value={sessionType}
          onChange={(e) => setSessionType(e.target.value)}
          style={styles.select}
        >
          {sessionTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Input Prompt */}
      <div style={styles.promptBox}>
        <p style={styles.promptText}>{prompts[sessionType]}</p>
      </div>

      {/* Tip about keyboard voice-to-text */}
      <div style={styles.tipBox}>
        <p style={styles.tipText}>💡 Use your phone's keyboard voice-to-text. Speak naturally—we'll understand!</p>
      </div>

      {/* Textarea */}
      <div style={styles.formGroup}>
        <label style={styles.label}>Your Notes</label>
        <textarea
          ref={textareaRef}
          value={transcript}
          onChange={handleTextChange}
          placeholder="Type or use voice-to-text..."
          style={styles.textarea}
        />
      </div>

      {/* Intensity */}
      <div style={styles.intensityGroup}>
        <label style={styles.label}>Intensity: {intensity}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          style={styles.slider}
        />
        <div style={styles.scaleIndicators}>
          <div style={styles.scaleItem}>
            <span style={styles.emoji}>😇</span>
            <span style={styles.scaleLabel}>Zone 2</span>
          </div>
          <div style={styles.scaleItem}>
            <span style={styles.emoji}>💪</span>
            <span style={styles.scaleLabel}>Active</span>
          </div>
          <div style={styles.scaleItem}>
            <span style={styles.emoji}>🔥</span>
            <span style={styles.scaleLabel}>Max</span>
          </div>
        </div>
      </div>

      {/* Insight Box */}
      {insight && (
        <div style={styles.insightBox}>
          <p style={styles.insightLabel}>💡 Insight</p>
          <p style={styles.insightText}>{insight}</p>
          {isEditing && (
            <p style={styles.insightNote}>From {new Date(editingEntry!.created_at).toLocaleDateString()}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !transcript}
        style={{
          ...styles.submitButton,
          opacity: loading || !transcript ? 0.5 : 1
        }}
      >
        {loading ? 'Saving...' : isEditing ? 'Update' : 'Save & Done'}
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: 'var(--space-sm)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 'var(--space-xs)'
  },
  formGroup: {
    marginBottom: 0
  },
  intensityGroup: {
    marginBottom: 0
  },
  label: {
    display: 'block' as const,
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    marginBottom: 'var(--space-xs)',
    color: 'var(--color-black)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  select: {
    width: '100%',
    padding: 'var(--space-xs) var(--space-sm)',
    border: '1px solid var(--color-light-gray)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-sm)',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer'
  },
  promptBox: {
    backgroundColor: 'var(--color-off-white)',
    border: '1px solid var(--color-light-gray)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 0
  },
  promptText: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-dark-gray)',
    margin: 0,
    lineHeight: 'var(--line-height-normal)',
    fontWeight: 'var(--font-weight-regular)'
  },
  tipBox: {
    backgroundColor: 'var(--color-off-white)',
    border: '1px solid var(--color-light-gray)',
    padding: 'var(--space-xs) var(--space-sm)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 0
  },
  tipText: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-dark-gray)',
    margin: 0,
    lineHeight: 'var(--line-height-normal)'
  },
  textarea: {
    width: '100%',
    padding: 'var(--space-sm)',
    border: '1px solid var(--color-light-gray)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-xs)',
    fontFamily: 'var(--font-body)',
    minHeight: '120px',
    resize: 'vertical' as const,
    fontWeight: 'var(--font-weight-regular)',
    overflow: 'hidden',
    boxSizing: 'border-box' as const
  },
  slider: {
    width: '100%',
    height: '4px',
    marginTop: 'var(--space-xs)',
    marginBottom: 'var(--space-xs)',
    cursor: 'pointer',
    background: 'var(--color-light-gray)'
  },
  scaleIndicators: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-mid-gray)',
    fontWeight: 'var(--font-weight-medium)',
    marginBottom: 0
  },
  scaleItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 'var(--space-xs)'
  },
  emoji: {
    fontSize: 'var(--font-size-lg)'
  },
  scaleLabel: {
    textAlign: 'center' as const,
    fontSize: 'var(--font-size-xs)'
  },
  insightBox: {
    backgroundColor: 'var(--color-light-gray)',
    border: '1px solid var(--color-light-gray)',
    padding: 'var(--space-sm)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 0
  },
  insightLabel: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-medium)',
    color: 'var(--color-dark-gray)',
    margin: '0 0 var(--space-xs) 0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  insightText: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-black)',
    margin: 0,
    lineHeight: 'var(--line-height-normal)',
    marginBottom: 'var(--space-xs)'
  },
  insightNote: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-mid-gray)',
    margin: '0',
    fontStyle: 'italic'
  },
  submitButton: {
    width: '100%',
    padding: 'var(--space-sm)',
    backgroundColor: 'var(--color-black)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast)',
    marginTop: 'var(--space-xs)'
  }
};
