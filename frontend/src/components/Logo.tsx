import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LogoProps {
  fixed?: boolean;  // true = fixed positioning, false = normal flow
}

export const Logo: React.FC<LogoProps> = ({ fixed = true }) => {
  const navigate = useNavigate();

  const baseStyles = {
    fontFamily: 'Quicksand, sans-serif',
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: '#555',
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'opacity 0.2s ease',
  };

  const fixedStyles = fixed ? {
    position: 'fixed' as const,
    top: '20px',
    right: '20px',
  } : {
    textAlign: 'right' as const,
    paddingRight: '20px',
    paddingTop: '10px',
  };

  return (
    <div
      style={{ ...baseStyles, ...fixedStyles }}
      onClick={() => navigate('/')}
      title="Back to home"
    >
      .rlxed
    </div>
  );
};