/**
 * BackButton Component
 * 
 * Circular dark back arrow button positioned at top-left.
 * Includes gold glow hover effect for better visibility.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';

export default function BackButton({ onBack }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onBack}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        backgroundColor: COLORS.maroon.dark,
        border: `2px solid ${isHovered ? COLORS.gold.primary : COLORS.gold.border}`,
        color: COLORS.text.gold,
        fontFamily: FONTS.primary,
        fontSize: '20px',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: isHovered ? `0 0 12px ${COLORS.gold.primary}` : '0 2px 8px rgba(0,0,0,0.3)',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        zIndex: 100,
      }}
    >
      ←
    </button>
  );
}
