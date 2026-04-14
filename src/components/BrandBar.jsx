/**
 * BrandBar Component
 * 
 * Horizontal branding bar with "WildConnect WiFi Lag" text.
 * Used on registration step pages. Maroon background with gold text.
 */

import { COLORS, FONTS } from '../constants/theme';

export default function BrandBar() {
  return (
    <div
      style={{
        backgroundColor: COLORS.maroon.medium,
        borderBottom: `2px solid ${COLORS.gold.border}`,
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '28px' }}>📶</span>
      <span
        style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: COLORS.text.gold,
          fontFamily: FONTS.primary,
        }}
      >
        WildConnect WiFi Lag
      </span>
    </div>
  );
}
