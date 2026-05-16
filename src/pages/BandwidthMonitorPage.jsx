/**
 * BandwidthMonitorPage Component
 *
 * Real-time bandwidth usage tracking for WiFi.
 * Follows the WildConnect dashboard design system:
 *   - Maroon/gold color palette via COLORS & FONTS constants
 *   - Card component for all panels
 *   - DashboardSidebar for navigation
 *   - Same layout pattern as DashboardPage
 *
 * Dependencies:
 *   npm install chart.js react-chartjs-2
 *
 * Usage:
 *   // In your router / App.jsx, add a case for 'bandwidth':
 *   case 'bandwidth':
 *     return <BandwidthMonitorPage onNavigate={onNavigate} onLogout={onLogout} userName={userName} />;
 *
 *   // In constants/theme.js, add to MENU_FEATURES:
 *   { key: 'bandwidth', icon: '📡', title: 'Bandwidth Monitor', desc: 'Real-time WiFi usage tracking and device analytics.' }
 */

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { bandwidthService } from '../services/authService';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_POINTS = 30;

const DAILY_HISTORY = [
  { day: 'Mon', gb: 5.1 },
  { day: 'Tue', gb: 3.8 },
  { day: 'Wed', gb: 2.4 },
  { day: 'Thu', gb: 1.9 },
  { day: 'Fri', gb: 3.2 },
  { day: 'Sat', gb: 2.1 },
  { day: 'Sun', gb: 1.3 },
];

const HOURLY_HISTORY = [
  { day: '8am',  gb: 0.2 },
  { day: '10am', gb: 0.8 },
  { day: '12pm', gb: 1.4 },
  { day: '2pm',  gb: 0.9 },
  { day: '4pm',  gb: 1.1 },
  { day: '6pm',  gb: 1.7 },
  { day: '8pm',  gb: 2.1 },
];

const DEVICES = [
  { icon: '📱', name: 'iPhone 14 Pro',  ip: '192.168.1.102', band: '5GHz',   usageGb: 1.24, pct: 38.8, color: '#4CAF50' },
  { icon: '💻', name: 'MacBook Air',    ip: '192.168.1.104', band: '5GHz',   usageGb: 1.60, pct: 50.0, color: COLORS.gold.primary },
  { icon: '📺', name: 'Smart TV',       ip: '192.168.1.108', band: '2.4GHz', usageGb: 0.36, pct: 11.2, color: '#e8a050' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomDl() { return parseFloat((15 + Math.random() * 25).toFixed(1)); }
function randomUl() { return parseFloat((4  + Math.random() * 12).toFixed(1)); }

function makeInitialSeries(fn) {
  return Array.from({ length: MAX_POINTS }, fn);
}

function makeLabels() {
  return Array.from({ length: MAX_POINTS }, (_, i) =>
    i === MAX_POINTS - 1 ? 'now' : `-${MAX_POINTS - 1 - i}s`
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function LiveBadge() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: 'rgba(76,175,80,0.15)',
      border: '1px solid rgba(76,175,80,0.4)',
      borderRadius: '20px', padding: '6px 14px',
      fontSize: '13px', color: '#4CAF50',
      fontFamily: FONTS.mono,
    }}>
      <span style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: '#4CAF50',
        animation: 'bm-pulse 1.4s ease infinite',
        display: 'inline-block',
      }} />
      LIVE
    </div>
  );
}

function StatCard({ value, unit, label, color }) {
  return (
    <Card style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{
        fontSize: '22px', fontWeight: 'bold',
        fontFamily: FONTS.mono, color,
        marginBottom: '2px',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '10px', color: COLORS.textMuted, fontFamily: FONTS.mono, marginBottom: '2px' }}>
        {unit}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
        {label}
      </div>
    </Card>
  );
}

function ProgressBar({ pct, color, height = 10 }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: height / 2,
      backgroundColor: 'rgba(61,8,8,0.7)', overflow: 'hidden',
    }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        borderRadius: height / 2,
        background: color || `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
        transition: 'width 0.5s ease',
      }} />
    </div>
  );
}

function DeviceRow({ icon, name, ip, band, usageGb, pct, color, isLast }) {
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 0',
        borderBottom: isLast ? 'none' : `1px solid ${COLORS.gold.border}`,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: 'rgba(212,168,67,0.12)',
          border: `1px solid ${COLORS.gold.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary }}>
            {name}
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
            {ip} · {band}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', fontFamily: FONTS.mono, color: COLORS.text.gold, fontWeight: 'bold' }}>
            {usageGb.toFixed(2)} GB
          </div>
          <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>
            {pct.toFixed(1)}%
          </div>
        </div>
      </div>
      <div style={{ marginBottom: isLast ? 0 : '4px' }}>
        <ProgressBar pct={pct} color={color} height={6} />
      </div>
    </>
  );
}

function SpeedBox({ value, label, color }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(61,8,8,0.4)',
      border: `1px solid ${COLORS.gold.border}`,
      borderRadius: '10px', padding: '14px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: FONTS.mono, color }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: COLORS.textMuted }}>Mbps</div>
      <div style={{ fontSize: '11px', color: COLORS.textMuted, marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function UsageBar({ day, gb, maxGb }) {
  const pct = ((gb / maxGb) * 100).toFixed(1);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
      <div style={{
        fontSize: '11px', color: COLORS.textMuted,
        fontFamily: FONTS.mono, width: '32px', flexShrink: 0,
      }}>
        {day}
      </div>
      <div style={{
        flex: 1, height: '8px', borderRadius: '4px',
        background: 'rgba(61,8,8,0.6)', overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: '4px',
          background: `linear-gradient(90deg, ${COLORS.gold.primary}, ${COLORS.gold.light})`,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <div style={{
        fontSize: '11px', fontFamily: FONTS.mono,
        color: COLORS.textMuted, width: '38px', textAlign: 'right', flexShrink: 0,
      }}>
        {gb.toFixed(1)}G
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function BandwidthMonitorPage({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('bandwidth-monitor');
  const [usageView, setUsageView] = useState('daily');
  const [totalUsage, setTotalUsage] = useState(3.2);
  const [loading, setLoading] = useState(true);

  // Real-time speed series
  const [dlHistory, setDlHistory] = useState(() => makeInitialSeries(randomDl));
  const [ulHistory, setUlHistory] = useState(() => makeInitialSeries(randomUl));
  const [labels] = useState(makeLabels);

  // Countdown timer state (14 days, 6 hours, 22 min, 41 sec)
  const [countdown, setCountdown] = useState({ d: 14, h: 6, m: 22, s: 41 });

  useEffect(() => {
    bandwidthService.getTotalUsage()
      .then(val => { if (typeof val === 'number') setTotalUsage(val / 1024); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Live speed tick
  useEffect(() => {
    const id = setInterval(() => {
      setDlHistory(prev => [...prev.slice(1), randomDl()]);
      setUlHistory(prev => [...prev.slice(1), randomUl()]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  // Countdown tick
  useEffect(() => {
    const id = setInterval(() => {
      setCountdown(prev => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d = Math.max(0, d - 1); }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleMenuNavigate = (key) => {
    if (key === 'my-account') { onNavigate('my-account'); return; }
    setActiveMenu(key);
    onNavigate(key);
  };

  const currentDl = dlHistory[dlHistory.length - 1];
  const currentUl = ulHistory[ulHistory.length - 1];
  const historyData = usageView === 'daily' ? DAILY_HISTORY : HOURLY_HISTORY;
  const maxGb = Math.max(...historyData.map(d => d.gb));
  const weeklyTotal = DAILY_HISTORY.reduce((s, d) => s + d.gb, 0);
  const dailyAvg = weeklyTotal / DAILY_HISTORY.length;
  const peakDay = DAILY_HISTORY.reduce((a, b) => (a.gb > b.gb ? a : b));

  const pad = n => String(n).padStart(2, '0');

  // Chart.js config
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Download',
        data: dlHistory,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76,175,80,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Upload',
        data: ulHistory,
        borderColor: COLORS.gold.primary,
        backgroundColor: 'rgba(212,168,67,0.08)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.4,
        borderDash: [4, 3],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: ${ctx.parsed.y.toFixed(1)} Mbps`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: COLORS.textMuted, font: { size: 10 }, maxTicksLimit: 6 },
        grid: { color: 'rgba(212,168,67,0.08)' },
      },
      y: {
        min: 0,
        max: 50,
        ticks: {
          color: COLORS.textMuted,
          font: { size: 10 },
          callback: v => `${v}M`,
        },
        grid: { color: 'rgba(212,168,67,0.08)' },
      },
    },
  };

  // ---------------------------------------------------------------------------
  // Styles (inline, matching DashboardPage patterns)
  // ---------------------------------------------------------------------------

  const sectionTitle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.textHeading,
    fontFamily: FONTS.primary,
    marginBottom: '16px',
  };

  const toggleBtn = (active) => ({
    padding: '6px 14px',
    borderRadius: '20px',
    border: `1px solid ${active ? COLORS.gold.primary : COLORS.gold.border}`,
    background: active ? 'rgba(212,168,67,0.18)' : 'transparent',
    color: active ? COLORS.text.gold : COLORS.textMuted,
    fontSize: '12px',
    cursor: 'pointer',
    fontFamily: FONTS.primary,
    transition: 'all 0.2s',
  });

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes bm-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.85); }
        }
      `}</style>

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
          <header style={{
            backgroundColor: COLORS.maroon.dark,
            borderBottom: `2px solid ${COLORS.gold.border}`,
            padding: '20px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>📡</span>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                Bandwidth Monitor
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

          {/* Page Content */}
          <main style={{ padding: '40px' }}>

            {/* Page title row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '6px' }}>
                  Real-time Bandwidth
                </h2>
                <p style={{ fontSize: '15px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                  Monitor your WiFi speed, data usage, and connected devices
                </p>
              </div>
              <LiveBadge />
            </div>

            {/* ── Banner: Monthly Cap ── */}
            <Card style={{
              marginBottom: '28px',
              background: `linear-gradient(135deg, ${COLORS.maroon.medium} 0%, ${COLORS.maroon.light} 100%)`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '6px' }}>
                    Monthly Data Cap
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>
                    {totalUsage.toFixed(1)}{' '}
                    <span style={{ fontSize: '18px', color: COLORS.text.mutedGold }}>GB</span>{' '}
                    <span style={{ fontSize: '16px', color: COLORS.text.mutedGold }}>of 5 GB</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                    Resets in
                  </div>
                  <div style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.text.white, fontFamily: FONTS.mono }}>
                    {countdown.d}d {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
                <span>Used: <strong style={{ color: COLORS.text.gold }}>{Math.round((totalUsage / 5) * 100)}%</strong></span>
                <span>Remaining: <strong style={{ color: '#4CAF50' }}>{(5 - totalUsage).toFixed(1)} GB</strong></span>
              </div>
              <ProgressBar pct={Math.round((totalUsage / 5) * 100)} height={14} />
              <p style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '8px', margin: '8px 0 0' }}>
                {loading ? 'Loading usage data...' : `Current usage: ${totalUsage.toFixed(1)} GB of 5 GB cap.`}
              </p>
            </Card>

            {/* ── Stats Row ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '28px',
            }}>
              <StatCard value={currentDl.toFixed(1)} unit="Mbps ↓" label="Download Speed" color="#4CAF50" />
              <StatCard value={currentUl.toFixed(1)} unit="Mbps ↑" label="Upload Speed"   color={COLORS.text.gold} />
              <StatCard value="12"                   unit="ms"     label="Ping / Latency"  color="#4CAF50" />
              <StatCard value="3"                    unit="devices" label="Active Devices" color={COLORS.text.gold} />
            </div>

            {/* ── Real-time Chart + Devices ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>

              {/* Speed Chart */}
              <Card>
                <h3 style={sectionTitle}>Real-time Speed</h3>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                  <SpeedBox value={currentDl.toFixed(1)} label="↓ Download" color="#4CAF50" />
                  <SpeedBox value={currentUl.toFixed(1)} label="↑ Upload"   color={COLORS.text.gold} />
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', gap: '16px', marginBottom: '10px', fontSize: '12px', color: COLORS.textMuted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '20px', height: '2px', background: '#4CAF50', display: 'inline-block' }} />
                    Download
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '20px', height: '2px', background: COLORS.gold.primary, display: 'inline-block', borderTop: '2px dashed' }} />
                    Upload
                  </span>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '160px' }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </Card>

              {/* Connected Devices */}
              <Card>
                <h3 style={sectionTitle}>Connected Devices</h3>
                {DEVICES.map((device, idx) => (
                  <DeviceRow
                    key={device.name}
                    {...device}
                    isLast={idx === DEVICES.length - 1}
                  />
                ))}
              </Card>
            </div>

            {/* ── Weekly Usage History ── */}
            <h3 style={{ ...sectionTitle, marginBottom: '20px' }}>Weekly Usage History</h3>
            <Card style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '16px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                  {usageView === 'daily' ? 'Last 7 days' : 'Today by hour'}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['daily', 'hourly'].map(v => (
                    <button
                      key={v}
                      style={toggleBtn(usageView === v)}
                      onClick={() => setUsageView(v)}
                    >
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {historyData.map(item => (
                <UsageBar key={item.day} day={item.day} gb={item.gb} maxGb={maxGb} />
              ))}

              <div style={{
                borderTop: `1px solid ${COLORS.gold.border}`,
                paddingTop: '16px', marginTop: '8px',
                display: 'flex', justifyContent: 'space-between',
                fontSize: '13px', color: COLORS.textMuted,
                fontFamily: FONTS.primary,
              }}>
                <span>
                  Weekly total:{' '}
                  <span style={{ color: COLORS.text.gold, fontWeight: 'bold', fontFamily: FONTS.mono }}>
                    {weeklyTotal.toFixed(1)} GB
                  </span>
                </span>
                <span>
                  Daily avg:{' '}
                  <span style={{ color: COLORS.text.gold, fontFamily: FONTS.mono }}>
                    {dailyAvg.toFixed(2)} GB
                  </span>
                </span>
                <span>
                  Peak:{' '}
                  <span style={{ color: COLORS.text.gold, fontFamily: FONTS.mono }}>
                    {peakDay.day} — {peakDay.gb} GB
                  </span>
                </span>
              </div>
            </Card>

          </main>
        </div>
      </div>
    </>
  );
}
