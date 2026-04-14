/**
 * Card Component
 * 
 * Reusable rounded content card wrapper with maroon background
 * and gold border. Used throughout the application for consistent styling.
 */

import { COLORS, FONTS } from '../constants/theme';

export default function Card({ children, style }) {
  return (
    <div
      style={{
        backgroundColor: COLORS.backgrounds.card,
        border: `1px solid ${COLORS.gold.border}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        fontFamily: FONTS.primary,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
