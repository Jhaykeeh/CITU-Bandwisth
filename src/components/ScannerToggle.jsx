/**
 * ScannerToggle Component
 * 
 * Two-tab toggle switch for "Scanner Mode" and "Manual Entry".
 * Active tab highlighted in gold. Controlled component with state.
 */

import { COLORS, FONTS } from '../constants/theme';

export default function ScannerToggle({ mode, onToggle }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: COLORS.maroon.dark,
        borderRadius: '8px',
        padding: '4px',
        border: `1px solid ${COLORS.gold.border}`,
      }}
    >
      <button
        onClick={() => onToggle('scanner')}
        style={{
          flex: 1,
          padding: '10px 20px',
          backgroundColor: mode === 'scanner' ? COLORS.gold.primary : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: mode === 'scanner' ? COLORS.maroon.dark : COLORS.text.mutedGold,
          fontFamily: FONTS.primary,
          fontSize: '14px',
          fontWeight: mode === 'scanner' ? 'bold' : 'normal',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        📷 Scanner Mode
      </button>
      <button
        onClick={() => onToggle('manual')}
        style={{
          flex: 1,
          padding: '10px 20px',
          backgroundColor: mode === 'manual' ? COLORS.gold.primary : 'transparent',
          border: 'none',
          borderRadius: '6px',
          color: mode === 'manual' ? COLORS.maroon.dark : COLORS.text.mutedGold,
          fontFamily: FONTS.primary,
          fontSize: '14px',
          fontWeight: mode === 'manual' ? 'bold' : 'normal',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        ⌨️ Manual Entry
      </button>
    </div>
  );
}
