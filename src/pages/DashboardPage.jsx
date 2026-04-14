/**
 * DashboardPage Component
 * 
 * Authenticated dashboard with top header, sidebar navigation, welcome banner,
 * stats cards, quick access feature grid, and recent activity list.
 */

import { useState } from 'react';
import { COLORS, FONTS, MENU_FEATURES } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

export default function DashboardPage({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleMenuNavigate = (key) => {
    setActiveMenu(key);
  };

  const stats = [
    { icon: '📶', label: 'Connection Status', value: 'Connected', color: '#4CAF50' },
    { icon: '💻', label: 'Connected Devices', value: '3', color: COLORS.text.gold },
    { icon: '📅', label: 'Days Registered', value: '45', color: COLORS.text.gold },
    { icon: '⏱️', label: 'Uptime', value: '99.8%', color: '#4CAF50' },
  ];

  const recentActivity = [
    { time: '2 hours ago', event: 'New device connected', details: 'iPhone 14 Pro - MacBook-Air.local' },
    { time: '5 hours ago', event: 'Bandwidth threshold alert', details: 'Reached 80% of daily allocation (4.0 GB / 5.0 GB)' },
    { time: '1 day ago', event: 'Device disconnected', details: 'Windows PC - DESKTOP-ABC123' },
    { time: '2 days ago', event: 'WiFi registration completed', details: 'Successfully registered Samsung Galaxy S23' },
    { time: '3 days ago', event: 'Account login', details: 'Successful login from 192.168.1.105' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      {/* Sidebar */}
      <DashboardSidebar
        activeKey={activeMenu}
        onNavigate={handleMenuNavigate}
        onLogout={onLogout}
        userName={userName}
      />

      {/* Main Content */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        {/* Top Header */}
        <header
          style={{
            backgroundColor: COLORS.maroon.dark,
            borderBottom: `2px solid ${COLORS.gold.border}`,
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>📶</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              WildConnect
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
              Welcome back,
            </span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              {userName}
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main style={{ padding: '40px' }}>
          {/* Welcome Banner - Keep maroon gradient */}
          <Card style={{ marginBottom: '32px', background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)` }}>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
                Welcome back, {userName}! 👋
              </h2>
              <p style={{ fontSize: '16px', color: COLORS.text.white, fontFamily: FONTS.primary, margin: 0 }}>
                Monitor your bandwidth usage and manage your network connections
              </p>
            </div>

            {/* Bandwidth Usage Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
                  Bandwidth Usage
                </span>
                <span style={{ fontSize: '14px', color: COLORS.text.gold, fontFamily: FONTS.mono, fontWeight: 'bold' }}>
                  3.2 GB of 5 GB
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '12px',
                  backgroundColor: 'rgba(61,8,8,0.6)',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: '64%',
                    height: '100%',
                    background: `linear-gradient(90deg, ${COLORS.gold.primary} 0%, ${COLORS.gold.light} 100%)`,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <p style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '6px', marginBottom: 0 }}>
                64% used · 1.8 GB remaining
              </p>
            </div>
          </Card>

          {/* Stats Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {stats.map((stat, idx) => (
              <Card key={idx} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Quick Access Grid */}
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px' }}>
            Quick Access
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {MENU_FEATURES.map((feature, idx) => (
              <Card
                key={idx}
                onMouseEnter={() => setHoveredCard(feature.key)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: hoveredCard === feature.key ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: hoveredCard === feature.key ? '0 8px 24px rgba(212,168,67,0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
                  border: hoveredCard === feature.key ? `2px solid ${COLORS.gold.primary}` : `1px solid ${COLORS.gold.border}`,
                }}
                onClick={() => handleMenuNavigate(feature.key)}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '8px' }}>
                    {feature.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.primary, lineHeight: '1.5', margin: 0 }}>
                    {feature.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px' }}>
            Recent Activity
          </h3>
          <Card style={{ padding: '0' }}>
            {recentActivity.map((activity, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px 24px',
                  borderBottom: idx < recentActivity.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: COLORS.gold.primary,
                    marginTop: '6px',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                      {activity.event}
                    </span>
                    <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                      {activity.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0, lineHeight: '1.5' }}>
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </main>
      </div>
    </div>
  );
}
