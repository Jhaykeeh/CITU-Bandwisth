/**
 * LandingPage Component
 * 
 * Public home page with hero section, stats bar, features grid,
 * and CTA banner. Uses Navbar and Footer for consistent navigation.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function LandingPage({ onNavigate }) {
  const [hoveredButton, setHoveredButton] = useState(null);

  const features = [
    { icon: '📶', title: 'WiFi Registration', desc: 'Quick and easy device registration for campus network access' },
    { icon: '📊', title: 'Real-Time Monitoring', desc: 'Track bandwidth usage and network performance in real-time' },
    { icon: '⚖️', title: 'Fair Usage Policy', desc: 'Ensure equitable bandwidth distribution across all users' },
    { icon: '📈', title: 'Detailed Reports', desc: 'Comprehensive analytics and usage reports for administrators' },
    { icon: '🔐', title: 'Admin Control Panel', desc: 'Full administrative control over network settings and policies' },
    { icon: '🔔', title: 'Instant Alerts', desc: 'Real-time notifications for network anomalies and threshold breaches' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="landing" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section
        style={{
          background: COLORS.backgrounds.gradient,
          padding: '100px 40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
            marginBottom: '20px',
            lineHeight: '1.2',
          }}
        >
          WildConnect — Intelligent Bandwidth Management for CITU
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: COLORS.text.white,
            fontFamily: FONTS.primary,
            marginBottom: '40px',
            maxWidth: '800px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
          }}
        >
          Empowering Cebu Institute of Technology – University with smart network monitoring,
          fair bandwidth allocation, and seamless connectivity for over 12,000 users.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            onMouseEnter={() => setHoveredButton('get-started')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => onNavigate('register')}
            style={{
              backgroundColor: hoveredButton === 'get-started' ? COLORS.gold.light : COLORS.gold.primary,
              color: COLORS.maroon.dark,
              border: 'none',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: FONTS.primary,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredButton === 'get-started' ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: hoveredButton === 'get-started' ? '0 6px 20px rgba(212,168,67,0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            Get Started →
          </button>
          <button
            onMouseEnter={() => setHoveredButton('learn-more')}
            onMouseLeave={() => setHoveredButton(null)}
            onClick={() => onNavigate('about')}
            style={{
              backgroundColor: hoveredButton === 'learn-more' ? COLORS.maroon.light : COLORS.maroon.medium,
              color: COLORS.text.gold,
              border: `2px solid ${COLORS.gold.primary}`,
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 'bold',
              fontFamily: FONTS.primary,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: hoveredButton === 'learn-more' ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <section
        style={{
          backgroundColor: COLORS.maroon.dark,
          borderTop: `2px solid ${COLORS.gold.border}`,
          borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '30px 40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            maxWidth: '1200px',
            margin: '0 auto',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {[
            { value: '12,000+', label: 'Users' },
            { value: '98%', label: 'Uptime' },
            { value: '40 Gbps', label: 'Bandwidth' },
            { value: '3,200+', label: 'Devices' },
          ].map((stat, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '4px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 40px', flex: 1 }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '36px',
            fontWeight: 'bold',
            color: COLORS.text.gold,
            fontFamily: FONTS.primary,
            marginBottom: '60px',
          }}
        >
          Powerful Features
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {features.map((feature, idx) => (
            <Card key={idx}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '12px' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section
        style={{
          background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
          padding: '60px 40px',
          textAlign: 'center',
          borderTop: `2px solid ${COLORS.gold.border}`,
        }}
      >
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '20px' }}>
          Ready to Get Started?
        </h2>
        <p style={{ fontSize: '18px', color: COLORS.text.white, fontFamily: FONTS.primary, marginBottom: '30px' }}>
          Join thousands of CITU users enjoying optimized network connectivity
        </p>
        <button
          onMouseEnter={() => setHoveredButton('register')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => onNavigate('register')}
          style={{
            backgroundColor: hoveredButton === 'register' ? COLORS.gold.light : COLORS.gold.primary,
            color: COLORS.maroon.dark,
            border: 'none',
            padding: '16px 40px',
            fontSize: '18px',
            fontWeight: 'bold',
            fontFamily: FONTS.primary,
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            transform: hoveredButton === 'register' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow: hoveredButton === 'register' ? '0 6px 20px rgba(212,168,67,0.4)' : '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          Register Now
        </button>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
