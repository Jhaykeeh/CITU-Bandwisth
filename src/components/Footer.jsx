/**
 * Footer Component
 * 
 * 3-column footer layout: Brand + tagline, Quick Links, Contact Info.
 * Includes copyright bar at the bottom. All links trigger navigation.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';

export default function Footer({ onNavigate }) {
  const [hoveredLink, setHoveredLink] = useState(null);

  const quickLinks = [
    { key: 'landing', label: 'Home' },
    { key: 'about', label: 'About Us' },
    { key: 'contact', label: 'Contact' },
    { key: 'login', label: 'Login' },
  ];

  return (
    <footer
      style={{
        backgroundColor: COLORS.maroon.dark,
        borderTop: `2px solid ${COLORS.gold.border}`,
        marginTop: 'auto',
      }}
    >
      {/* Main Footer Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
          padding: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>📶</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              WildConnect
            </span>
          </div>
          <p style={{ color: COLORS.text.mutedGold, fontFamily: FONTS.primary, fontSize: '14px', lineHeight: '1.6' }}>
            Intelligent Bandwidth Management for Cebu Institute of Technology – University
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 style={{ color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {quickLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => onNavigate(link.key)}
                onMouseEnter={() => setHoveredLink(link.key)}
                onMouseLeave={() => setHoveredLink(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: hoveredLink === link.key ? COLORS.text.gold : COLORS.text.mutedGold,
                  fontFamily: FONTS.primary,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0',
                  transition: 'color 0.3s ease',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info Column */}
        <div>
          <h4 style={{ color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
            Contact Us
          </h4>
          <div style={{ color: COLORS.text.mutedGold, fontFamily: FONTS.primary, fontSize: '14px', lineHeight: '1.8' }}>
            <p style={{ margin: '0' }}>N. Bacalso Ave, Cebu City</p>
            <p style={{ margin: '0' }}>(032) 261-7741</p>
            <p style={{ margin: '0' }}>wildconnect@cit.edu</p>
            <p style={{ margin: '0' }}>Mon–Fri 8AM–5PM</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          borderTop: `1px solid ${COLORS.gold.border}`,
          padding: '20px 40px',
          textAlign: 'center',
          color: COLORS.text.mutedGold,
          fontFamily: FONTS.primary,
          fontSize: '13px',
        }}
      >
        © 2025 WildConnect - CITU. All rights reserved.
      </div>
    </footer>
  );
}
