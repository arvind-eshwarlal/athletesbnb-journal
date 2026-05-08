import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number; // milliseconds
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Grayscale colors based on type
  const typeStyles = {
    success: {
      backgroundColor: 'var(--color-black)',
      color: 'white',
      icon: '✓'
    },
    error: {
      backgroundColor: 'var(--color-dark-gray)',
      color: 'white',
      icon: '✕'
    },
    info: {
      backgroundColor: 'var(--color-black)',
      color: 'white',
      icon: '•'
    }
  };

  const current = typeStyles[type];

  return (
    <div 
      style={{ 
        ...styles.container, 
        backgroundColor: current.backgroundColor,
        color: current.color
      }}
    >
      <span style={styles.icon}>{current.icon}</span>
      <span style={styles.message}>{message}</span>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed' as const,
    top: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-sm)',
    boxShadow: 'var(--shadow-lg)',
    zIndex: 'var(--z-toast)' as any,
    animation: 'slideInDown 300ms ease',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    maxWidth: '90%',
    minWidth: '150px'
  },
  icon: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-bold)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '16px'
  },
  message: {
    textAlign: 'center' as const
  }
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideInDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);
