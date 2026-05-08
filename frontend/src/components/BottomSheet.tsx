import React, { useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'half' | 'full' | 'auto';
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'half'
}) => {
  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const heightClass = {
    half: '50vh',
    full: '90vh',
    auto: 'auto'
  }[height];

  return (
    <>
      {/* Overlay */}
      <div
        style={styles.overlay}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet */}
      <div style={{ ...styles.container, maxHeight: heightClass }}>
        {/* Handle bar */}
        <div style={styles.handleBar}>
          <div style={styles.handle} />
        </div>

        {/* Header with close button */}
        {title && (
          <div style={styles.header}>
            <h2 style={styles.title}>{title}</h2>
            <button
              onClick={onClose}
              style={styles.closeButton}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 'var(--z-modal)' as any,
    animation: 'fadeIn 300ms ease'
  },
  container: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'var(--color-white)',
    borderTopLeftRadius: 'var(--radius-lg)',
    borderTopRightRadius: 'var(--radius-lg)',
    zIndex: 'calc(var(--z-modal) + 1)' as any,
    boxShadow: 'var(--shadow-xl)',
    display: 'flex',
    flexDirection: 'column' as const,
    animation: 'slideUp 300ms ease',
    overflowY: 'auto' as const,
    maxHeight: '90vh'
  },
  handleBar: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 'var(--space-md)',
    paddingBottom: 'var(--space-sm)'
  },
  handle: {
    width: '40px',
    height: '4px',
    backgroundColor: 'var(--color-light-gray)',
    borderRadius: 'var(--radius-full)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 'var(--space-md)',
    paddingRight: 'var(--space-md)',
    paddingBottom: 'var(--space-md)',
    borderBottom: '1px solid var(--color-light-gray)'
  },
  title: {
    fontSize: 'var(--font-size-xl)',
    fontFamily: 'var(--font-heading)',
    fontWeight: 'var(--font-weight-bold)',
    margin: 0,
    color: 'var(--color-black)'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: 'var(--font-size-xl)',
    cursor: 'pointer',
    color: 'var(--color-dark-gray)',
    padding: 'var(--space-xs)',
    transition: 'color var(--transition-fast)',
    ':hover': {
      color: 'var(--color-black)'
    }
  },
  content: {
    padding: 'var(--space-md)',
    paddingBottom: 'var(--space-xl)',
    flex: 1,
    overflowY: 'auto' as const
  }
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
document.head.appendChild(styleSheet);
