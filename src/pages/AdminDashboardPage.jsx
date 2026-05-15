import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Card from '../components/Card';

const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Network Overview', key: 'overview' },
  { icon: '👥', label: 'All Users',         key: 'users' },
  { icon: '📱', label: 'Device Requests',   key: 'devices' },
];

const MOCK_REQUESTS = [
  { id: 1, schoolId: '2021-00123', name: 'Juan Dela Cruz', brand: 'Apple',   model: 'iPhone 14 Pro', deviceNo: 1, status: 'PENDING',  submitted: '2 hours ago' },
  { id: 2, schoolId: '2021-00456', name: 'Maria Santos',   brand: 'Samsung', model: 'Galaxy S23',    deviceNo: 1, status: 'PENDING',  submitted: '4 hours ago' },
  { id: 3, schoolId: '2020-00789', name: 'Jose Reyes',     brand: 'Lenovo',  model: 'IdeaPad 5',     deviceNo: 2, status: 'APPROVED', submitted: '1 day ago' },
  { id: 4, schoolId: '2022-00012', name: 'Ana Cruz',       brand: 'Xiaomi',  model: 'Redmi Note 12', deviceNo: 1, status: 'REJECTED', submitted: '2 days ago' },
];

const MOCK_USERS = [
  { schoolId: '2021-00123', name: 'Juan Dela Cruz',  devices: 1, usage: '1.2 GB', status: 'Active' },
  { schoolId: '2021-00456', name: 'Maria Santos',    devices: 0, usage: '0 GB',   status: 'Pending' },
  { schoolId: '2020-00789', name: 'Jose Reyes',      devices: 2, usage: '4.1 GB', status: 'Active' },
  { schoolId: '2022-00012', name: 'Ana Cruz',         devices: 1, usage: '0.8 GB', status: 'Active' },
  { schoolId: '2023-00345', name: 'Pedro Bautista',  devices: 2, usage: '5.0 GB', status: 'Capped' },
];

export default function AdminDashboardPage({ onNavigate, onLogout }) {
  const [activeKey, setActiveKey] = useState('overview');
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const handleApprove = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r));
  const handleReject  = (id) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));

  const statusPill = (status) => ({
    padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
    fontWeight: 'bold', fontFamily: FONTS.mono,
    backgroundColor:
      status === 'APPROVED' ? 'rgba(76,175,80,0.15)' :
      status === 'PENDING'  ? 'rgba(255,193,7,0.15)'  :
      status === 'Active'   ? 'rgba(76,175,80,0.15)' :
      status === 'Capped'   ? 'rgba(244,67,54,0.15)' :
                              'rgba(244,67,54,0.15)',
    color:
      status === 'APPROVED' ? '#4CAF50' :
      status === 'PENDING'  ? '#FFC107' :
      status === 'Active'   ? '#4CAF50' :
      status === 'Capped'   ? '#F44336' :
                              '#F44336',
  });

  const pending  = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;

  const filteredRequests = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      {/* Admin Sidebar */}
      <aside style={{
        width: '240px', backgroundColor: COLORS.maroon.dark,
        borderRight: `2px solid ${COLORS.gold.border}`,
        display: 'flex', flexDirection: 'column', height: '100vh',
        position: 'sticky', top: 0,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${COLORS.gold.border}` }}>
          <div style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '2px' }}>Admin Panel</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>IT Administrator</div>
        </div>

        <nav style={{ flex: 1, padding: '16px 0' }}>
          {SIDEBAR_ITEMS.map(item => {
            const isActive = activeKey === item.key;
            return (
              <button key={item.key} onClick={() => setActiveKey(item.key)}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  width: '100%', background: isActive ? COLORS.gold.border : 'transparent',
                  border: 'none', borderLeft: isActive ? `4px solid ${COLORS.gold.primary}` : '4px solid transparent',
                  color: isActive ? COLORS.text.gold : COLORS.text.white,
                  fontFamily: FONTS.primary, fontSize: '14px', fontWeight: isActive ? 'bold' : 'normal',
                  cursor: 'pointer', padding: '14px 20px', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '10px',
                  transform: hoveredItem === item.key && !isActive ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.2s',
                }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.key === 'devices' && pending > 0 && (
                  <span style={{
                    marginLeft: 'auto', backgroundColor: '#F44336', color: '#fff',
                    borderRadius: '10px', padding: '2px 7px', fontSize: '11px', fontWeight: 'bold',
                  }}>{pending}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: `1px solid ${COLORS.gold.border}` }}>
          <button onClick={() => onNavigate('landing')} style={{
            width: '100%', backgroundColor: 'transparent', color: COLORS.text.mutedGold,
            border: `1px solid ${COLORS.gold.border}`, padding: '10px',
            borderRadius: '8px', fontFamily: FONTS.primary, fontSize: '13px', cursor: 'pointer',
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        <header style={{
          backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
            {SIDEBAR_ITEMS.find(i => i.key === activeKey)?.icon} {SIDEBAR_ITEMS.find(i => i.key === activeKey)?.label}
          </span>
          <span style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
            CITU-Bandwidth Monitoring System · Admin
          </span>
        </header>

        <main style={{ padding: '32px 40px' }}>

          {/* NETWORK OVERVIEW */}
          {activeKey === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {[
                  { label: 'Total Users',        value: MOCK_USERS.length, unit: 'accounts', color: COLORS.text.gold },
                  { label: 'Active Devices',      value: 7,   unit: 'devices',  color: '#4CAF50' },
                  { label: 'Pending Requests',    value: pending, unit: 'waiting', color: '#FFC107' },
                  { label: 'Approved Today',      value: approved, unit: 'devices', color: '#4CAF50' },
                ].map((stat, i) => (
                  <Card key={i} style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, fontFamily: FONTS.mono }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono, marginBottom: '2px' }}>{stat.unit}</div>
                    <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{stat.label}</div>
                  </Card>
                ))}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Network Bandwidth Stats
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {[
                  { label: 'This Hour', value: '120 GB', sub: 'Current throughput' },
                  { label: 'Today',     value: '2.4 TB', sub: 'Daily total usage' },
                  { label: 'This Month',value: '58 TB',  sub: 'Monthly total usage' },
                ].map((item, i) => (
                  <Card key={i} style={{ background: `linear-gradient(135deg, ${COLORS.maroon.medium}, ${COLORS.maroon.light})` }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>{item.value}</div>
                    <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '4px' }}>{item.sub}</div>
                  </Card>
                ))}
              </div>

              {/* Top users by usage */}
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Top Users by Usage
              </h3>
              <Card style={{ padding: '0' }}>
                {[...MOCK_USERS].sort((a, b) => parseFloat(b.usage) - parseFloat(a.usage)).map((user, idx) => (
                  <div key={user.schoolId} style={{
                    padding: '14px 24px',
                    borderBottom: idx < MOCK_USERS.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <div style={{ fontSize: '20px', width: '28px', textAlign: 'center', color: idx === 0 ? '#FFD700' : COLORS.textMuted }}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</div>
                      <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</div>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.mono }}>{user.usage}</div>
                    <span style={statusPill(user.status)}>{user.status}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ALL USERS */}
          {activeKey === 'users' && (
            <>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Registered Students ({MOCK_USERS.length})
              </h3>
              <Card style={{ padding: '0' }}>
                {/* Table header */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 90px',
                  padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`,
                  fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted,
                  fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>Student</span><span>School ID</span><span>Devices</span><span>Usage</span><span>Status</span>
                </div>
                {MOCK_USERS.map((user, idx) => (
                  <div key={user.schoolId} style={{
                    display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 90px',
                    padding: '14px 24px',
                    borderBottom: idx < MOCK_USERS.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, textAlign: 'center' }}>{user.devices}/2</span>
                    <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono }}>{user.usage}</span>
                    <span style={statusPill(user.status)}>{user.status}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* DEVICE REQUESTS */}
          {activeKey === 'devices' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
                  Device Registration Requests
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                      fontFamily: FONTS.primary, fontWeight: filter === f ? 'bold' : 'normal',
                      border: `1px solid ${filter === f ? COLORS.gold.primary : COLORS.gold.border}`,
                      background: filter === f ? 'rgba(212,168,67,0.15)' : 'transparent',
                      color: filter === f ? COLORS.text.gold : COLORS.textMuted,
                    }}>{f}</button>
                  ))}
                </div>
              </div>

              <Card style={{ padding: '0' }}>
                {filteredRequests.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                    No requests found.
                  </div>
                ) : filteredRequests.map((req, idx) => (
                  <div key={req.id} style={{
                    padding: '16px 24px',
                    borderBottom: idx < filteredRequests.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                      backgroundColor: 'rgba(212,168,67,0.1)', border: `1px solid ${COLORS.gold.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                    }}>
                      {req.brand === 'Apple' ? '📱' : '💻'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                        {req.name} · <span style={{ fontFamily: FONTS.mono, fontSize: '12px', color: COLORS.textMuted }}>{req.schoolId}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                        {req.brand} {req.model} — Device #{req.deviceNo} · {req.submitted}
                      </div>
                    </div>
                    <span style={statusPill(req.status)}>{req.status}</span>
                    {req.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApprove(req.id)} style={{
                          padding: '7px 16px', borderRadius: '6px', border: 'none',
                          backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50',
                          fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                          border: '1px solid rgba(76,175,80,0.4)',
                        }}>✓ Approve</button>
                        <button onClick={() => handleReject(req.id)} style={{
                          padding: '7px 16px', borderRadius: '6px', border: 'none',
                          backgroundColor: 'rgba(244,67,54,0.15)', color: '#F44336',
                          fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                          border: '1px solid rgba(244,67,54,0.4)',
                        }}>✗ Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}