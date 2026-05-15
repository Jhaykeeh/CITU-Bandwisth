/**
 * DashboardPage.jsx
 *
 * Student dashboard with:
 * - Header bandwidth pill
 * - Welcome + device count
 * - Bandwidth progress card
 * - Action buttons (Register Device / View Bandwidth)
 * - My Devices list with status badges
 * - Recent Activity feed
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

export default function DashboardPage({ onNavigate, onLogout, userName, userRole }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleMenuNavigate = (key) => {
    setActiveMenu(key);
    onNavigate(key);
  };

  const usedGb      = 1.2;
  const totalGb     = 5.0;
  const remainingGb = (totalGb - usedGb).toFixed(1);
  const usedPct     = Math.round((usedGb / totalGb) * 100);

  // Mock device data
  const devices = [
    { id: 1, brand: 'Apple',  model: 'iPhone 14 Pro', status: 'APPROVED', mac: 'A4:C3:F0:12:34:56' },
    { id: 2, brand: 'Lenovo', model: 'Vivobook 15',   status: 'PENDING',  mac: 'B8:27:EB:AB:CD:EF' },
  ];

  const recentActivity = [
    { time: '2 hours ago', event: 'Device connected',   details: 'iPhone 14 Pro joined CITU-WIFI' },
    { time: '5 hours ago', event: 'Bandwidth alert',    details: 'Reached 80% of daily allocation' },
    { time: '1 day ago',   event: 'Device approved',    details: 'Admin approved iPhone 14 Pro' },
    { time: '2 days ago',  event: 'Account created',    details: 'Welcome to CITU-Bandwidth Monitoring System' },
  ];

  const statusBadge = (status) => ({
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 'bold',
    fontFamily: FONTS.mono,
    backgroundColor:
      status === 'APPROVED' ? 'rgba(76,175,80,0.15)'  :
      status === 'PENDING'  ? 'rgba(255,193,7,0.15)'  :
                              'rgba(244,67,54,0.15)',
    color:
      status === 'APPROVED' ? '#4CAF50' :
      status === 'PENDING'  ? '#FFC107' :
                              '#F44336',
    border: `1px solid ${
      status === 'APPROVED' ? 'rgba(76,175,80,0.4)'  :
      status === 'PENDING'  ? 'rgba(255,193,7,0.4)'  :
                              'rgba(244,67,54,0.4)'}`,
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      {/* ── Sidebar ── */}
      <DashboardSidebar
        activeKey={activeMenu}
        onNavigate={handleMenuNavigate}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
      />

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>

        {/* ── Top Header ── */}
        <header style={{
          backgroundColor: COLORS.maroon.dark,
          borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '16px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>📶</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                CITU-Bandwidth Monitoring System
              </div>
              <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '1px' }}>
                Network: CITU-WIFI
              </div>
            </div>
          </div>

          {/* Bandwidth pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '14px',
              backgroundColor: 'rgba(212,168,67,0.08)',
              border: `1px solid ${COLORS.gold.border}`,
              borderRadius: '10px', padding: '8px 18px',
            }}>
              <div>
                <div style={{ fontSize: '10px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Current Usage</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>{usedGb} GB</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: COLORS.gold.border }} />
              <div>
                <div style={{ fontSize: '10px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>Remaining</div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#4CAF50', fontFamily: FONTS.mono }}>{remainingGb} GB</div>
              </div>
              <div style={{ width: '1px', height: '28px', backgroundColor: COLORS.gold.border }} />
              <div style={{ fontSize: '11px', color: '#4CAF50', fontFamily: FONTS.primary }}>● Active</div>
            </div>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              {userName}
            </span>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main style={{ padding: '32px 40px' }}>

          {/* Welcome */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '4px' }}>
              Welcome back, {userName} 👋
            </h2>
            <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
              Devices Registered:&nbsp;
              <strong style={{ color: COLORS.textBody }}>{devices.length} / 2</strong>
            </p>
          </div>

          {/* Bandwidth Progress Card */}
          <Card style={{
            marginBottom: '24px',
            background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                  Monthly Bandwidth Usage
                </div>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>
                  {usedGb} <span style={{ fontSize: '14px' }}>GB</span>
                  <span style={{ fontSize: '16px', color: COLORS.text.mutedGold }}> of {totalGb} GB</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', color: '#4CAF50', fontFamily: FONTS.primary }}>● Connected to CITU-WIFI</div>
                <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '2px' }}>Resets in 14 days</div>
              </div>
            </div>
            <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(61,8,8,0.6)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                width: `${usedPct}%`, height: '100%',
                background: `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
                borderRadius: '5px', transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '6px', marginBottom: 0 }}>
              {usedPct}% used · {remainingGb} GB remaining
            </p>
          </Card>

          {/* ── Action Buttons ── */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            {/* Register New Device */}
            <button
              onClick={() => onNavigate('wifi-registration')}
              style={{
                flex: 1, padding: '16px', borderRadius: '10px',
                border: 'none', cursor: 'pointer',
                backgroundColor: COLORS.gold.primary,
                color: COLORS.maroon.dark,
                fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              ➕ Register New Device
            </button>

            {/* View Bandwidth */}
            <button
              onClick={() => onNavigate('bandwidth-monitor')}
              style={{
                flex: 1, padding: '16px', borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: 'transparent',
                color: COLORS.text.gold,
                border: `2px solid ${COLORS.gold.primary}`,
                fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '15px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              📊 View Bandwidth
            </button>
          </div>

          {/* ── My Devices ── */}
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
            My Devices
          </h3>
          <Card style={{ padding: '0', marginBottom: '28px' }}>
            {devices.map((device, idx) => (
              <div key={device.id} style={{
                padding: '16px 24px',
                borderBottom: idx < devices.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                {/* Icon */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  backgroundColor: 'rgba(212,168,67,0.1)',
                  border: `1px solid ${COLORS.gold.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                }}>
                  {device.brand === 'Apple' ? '📱' : '💻'}
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                    {device.brand} {device.model}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                    MAC: {device.mac}
                  </div>
                </div>

                {/* Status badge */}
                <span style={statusBadge(device.status)}>{device.status}</span>
              </div>
            ))}

            {/* Add device slot hint */}
            {devices.length < 2 && (
              <div style={{
                padding: '14px 24px', textAlign: 'center',
                borderTop: `1px solid ${COLORS.gold.border}`,
              }}>
                <button
                  onClick={() => onNavigate('wifi-registration')}
                  style={{
                    background: 'none', border: 'none',
                    color: COLORS.text.gold, fontFamily: FONTS.primary,
                    fontSize: '13px', cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  + Add another device ({2 - devices.length} slot remaining)
                </button>
              </div>
            )}

            {/* All slots used notice */}
            {devices.length >= 2 && (
              <div style={{
                padding: '12px 24px', textAlign: 'center',
                borderTop: `1px solid ${COLORS.gold.border}`,
                fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary,
              }}>
                🔒 Maximum devices reached (2/2). Contact IT support to change a device.
              </div>
            )}
          </Card>

          {/* ── Recent Activity ── */}
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
            Recent Activity
          </h3>
          <Card style={{ padding: '0' }}>
            {recentActivity.map((item, idx) => (
              <div key={idx} style={{
                padding: '16px 24px',
                borderBottom: idx < recentActivity.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: COLORS.gold.primary,
                  marginTop: '6px', flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                      {item.event}
                    </span>
                    <span style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
                      {item.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                    {item.details}
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