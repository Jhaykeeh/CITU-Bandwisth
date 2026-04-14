/**
 * Navbar Component
 * 
 * Top navigation bar for public pages. Displays WildConnect logo
 * on the left and navigation links on the right. Active link
 * highlighted in gold. Includes hover effects on all links.
 */

import { useState } from 'react';
import { COLORS, FONTS, NAV_LINKS } from '../constants/theme';

export default function Navbar({ currentPage, onNavigate }) {
  const [hoveredLink, setHoveredLink] = useState(null);

  return (
    <nav
      style={{
        backgroundColor: COLORS.maroon.dark,
        borderBottom: `2px solid ${COLORS.gold.border}`,
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
        onClick={() => onNavigate('landing')}
      >
        <span style={{ fontSize: '28px' }}>📶</span>
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
          }}
        >
          WildConnect
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', gap: '32px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = currentPage === link.key;
          const isHovered = hoveredLink === link.key;

          return (
            <button
              key={link.key}
              onClick={() => onNavigate(link.key)}
              onMouseEnter={() => setHoveredLink(link.key)}
              onMouseLeave={() => setHoveredLink(null)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? COLORS.text.gold : COLORS.text.white,
                fontFamily: FONTS.primary,
                fontSize: '16px',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                padding: '8px 16px',
                borderBottom: isActive ? `2px solid ${COLORS.gold.primary}` : '2px solid transparent',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                opacity: isHovered ? 0.9 : 1,
              }}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
