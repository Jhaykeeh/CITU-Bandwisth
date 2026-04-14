/**
 * DashboardSidebar Component
 * 
 * Authenticated left sidebar navigation with 7 menu items from MENU_FEATURES.
 * Active item highlighted with gold left border. Includes logout button at bottom.
 */

import { useState } from 'react';
import { COLORS, FONTS, MENU_FEATURES } from '../constants/theme';

export default function DashboardSidebar({ activeKey, onNavigate, onLogout, userName }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: COLORS.maroon.dark,
        borderRight: `2px solid ${COLORS.gold.border}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
      }}
    >
      {/* User Info */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: `1px solid ${COLORS.gold.border}`,
        }}
      >
        <p style={{ color: COLORS.text.mutedGold, fontFamily: FONTS.primary, fontSize: '12px', margin: '0 0 4px 0' }}>
          Logged in as
        </p>
        <p style={{ color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
          {userName}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav style={{ flex: 1, padding: '16px 0' }}>
        {MENU_FEATURES.map((item) => {
          const isActive = activeKey === item.key;
          const isHovered = hoveredItem === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              onMouseEnter={() => setHoveredItem(item.key)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: '100%',
                background: isActive ? `${COLORS.gold.border}` : 'transparent',
                border: 'none',
                borderLeft: isActive ? `4px solid ${COLORS.gold.primary}` : '4px solid transparent',
                color: isActive ? COLORS.text.gold : COLORS.text.white,
                fontFamily: FONTS.primary,
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : 'normal',
                cursor: 'pointer',
                padding: '14px 20px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                transform: isHovered && !isActive ? 'translateX(4px)' : 'translateX(0)',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div
        style={{
          padding: '20px',
          borderTop: `1px solid ${COLORS.gold.border}`,
        }}
      >
        <button
          onClick={onLogout}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = COLORS.maroon.light;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = COLORS.maroon.medium;
          }}
          style={{
            width: '100%',
            backgroundColor: COLORS.maroon.medium,
            border: `1px solid ${COLORS.gold.primary}`,
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '12px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}
