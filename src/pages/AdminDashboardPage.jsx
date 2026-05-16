import { useState, useEffect } from 'react';
import { userService, deviceService } from '../services/authService';
import api from '../services/api';
import { COLORS, FONTS } from '../constants/theme';
import Card from '../components/Card';

const SIDEBAR_ITEMS = [
  { icon: '📊', label: 'Network Overview', key: 'overview' },
  { icon: '👥', label: 'All Users',         key: 'users' },
  { icon: '📱', label: 'Device Requests',   key: 'devices' },
  { icon: '📈', label: 'Usage Reports',     key: 'reports' },
  { icon: '🔐', label: 'Access Control',    key: 'access' },
  { icon: '⚙️',  label: 'Admin Panel',      key: 'admin' },
];

const MOCK_REQUESTS = [
  { id: 1, schoolId: '2021-00123', name: 'Juan Dela Cruz', brand: 'Apple',   model: 'iPhone 14 Pro', deviceNo: 1, status: 'APPROVED', submitted: '2 hours ago' },
  { id: 2, schoolId: '2021-00456', name: 'Maria Santos',   brand: 'Samsung', model: 'Galaxy S23',    deviceNo: 1, status: 'APPROVED', submitted: '4 hours ago' },
  { id: 3, schoolId: '2020-00789', name: 'Jose Reyes',     brand: 'Lenovo',  model: 'IdeaPad 5',     deviceNo: 2, status: 'PENDING',  submitted: '1 day ago' },
  { id: 4, schoolId: '2022-00012', name: 'Ana Cruz',       brand: 'Xiaomi',  model: 'Redmi Note 12', deviceNo: 1, status: 'APPROVED', submitted: '2 days ago' },
];

const MOCK_USERS = [
  { id: 1,  schoolId: '2021-00123', name: 'Juan Dela Cruz',  devices: 1, usage: '1.2 GB', usageRaw: 1.2, status: 'Active',  role: 'student', suspended: false },
  { id: 2,  schoolId: '2021-00456', name: 'Maria Santos',    devices: 0, usage: '0 GB',   usageRaw: 0,   status: 'Pending', role: 'student', suspended: false },
  { id: 3,  schoolId: '2020-00789', name: 'Jose Reyes',      devices: 2, usage: '4.1 GB', usageRaw: 4.1, status: 'Active',  role: 'student', suspended: false },
  { id: 4,  schoolId: '2022-00012', name: 'Ana Cruz',        devices: 1, usage: '0.8 GB', usageRaw: 0.8, status: 'Active',  role: 'student', suspended: false },
  { id: 5,  schoolId: '2023-00345', name: 'Pedro Bautista',  devices: 2, usage: '5.0 GB', usageRaw: 5.0, status: 'Capped',  role: 'student', suspended: false },
];

const MOCK_ADMINS = [
  { id: 1, name: 'IT Administrator', email: 'admin@citu.edu.ph',      role: 'Super Admin', lastLogin: '1 hour ago',  status: 'Active' },
  { id: 2, name: 'John Techstaff',   email: 'jtech@citu.edu.ph',      role: 'Admin',       lastLogin: '3 hours ago', status: 'Active' },
  { id: 3, name: 'Mary Support',     email: 'msupport@citu.edu.ph',   role: 'Support',     lastLogin: '2 days ago',  status: 'Inactive' },
];

const MOCK_LOGS = [
  { time: '10:02 AM', admin: 'IT Administrator', action: 'Approved device request', target: 'Juan Dela Cruz' },
  { time: '09:45 AM', admin: 'John Techstaff',   action: 'Suspended user',          target: 'Pedro Bautista' },
  { time: '09:30 AM', admin: 'IT Administrator', action: 'Changed bandwidth limit',  target: 'All Students' },
  { time: 'Yesterday', admin: 'Mary Support',    action: 'Reset password',           target: 'Maria Santos' },
  { time: 'Yesterday', admin: 'IT Administrator', action: 'Added new admin',         target: 'Mary Support' },
];

export default function AdminDashboardPage({ onLogout }) {
  const [activeKey, setActiveKey]     = useState('overview');
  const [requests, setRequests]       = useState(MOCK_REQUESTS);
  const [users, setUsers]             = useState(MOCK_USERS);
  const [admins, setAdmins]           = useState(MOCK_ADMINS);
  const [logs, setLogs]               = useState(MOCK_LOGS);
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load pending registrations from localStorage (submitted via WifiRegistrationPage)
        const pendingRaw = localStorage.getItem('pending_registrations');
        const pending = pendingRaw ? JSON.parse(pendingRaw) : [];

        const [allUsers, allDevices] = await Promise.all([
          userService.getAllUsers().catch(() => []),
          deviceService.getAllDevices().catch(() => []),
        ]);
        let apiRequests = [];
        if (Array.isArray(allDevices) && allDevices.length > 0) {
          apiRequests = allDevices.map(d => ({
            id: d.id,
            schoolId: d.userId?.toString() || '',
            name: d.brand + ' ' + d.model,
            brand: d.brand,
            model: d.model,
            voucherCode: null,
            deviceNo: d.approvalStatus === 'PENDING' ? 2 : 1,
            status: d.approvalStatus || (d.active ? 'APPROVED' : 'PENDING'),
            submitted: new Date(d.createdAt || Date.now()).toLocaleString(),
          }));
        }
        // Merge: pending from localStorage first, then API data
        setRequests([...pending, ...apiRequests]);

        if (Array.isArray(allUsers) && allUsers.length > 0) {
          setUsers(allUsers.map(u => ({
            id: u.id,
            schoolId: u.schoolId,
            name: u.schoolId,
            devices: 0,
            usage: '0 GB',
            usageRaw: 0,
            status: u.status === 'DISABLED' ? 'Suspended' : 'Active',
            role: u.role === 'ADMIN' ? 'admin' : 'student',
            suspended: u.status === 'DISABLED',
          })));
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      }
    };
    fetchData();
  }, []);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddAdmin, setShowAddAdmin]     = useState(false);
  const [newStudent, setNewStudent] = useState({ schoolId: '', name: '' });
  const [newAdmin, setNewAdmin]     = useState({ name: '', email: '', role: 'Admin' });
  const [accessError, setAccessError] = useState('');
  const [accessSuccess, setAccessSuccess] = useState('');
  const [filter, setFilter]           = useState('ALL');
  const [reportRange, setReportRange] = useState('week');

  // Admin Panel settings state
  const [bandwidthLimit, setBandwidthLimit]   = useState('5');
  const [maxDevices, setMaxDevices]           = useState('2');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoReject, setAutoReject]           = useState(true);
  const [settingsSaved, setSettingsSaved]     = useState(false);

  const handleApprove = async (id) => {
    try {
      await deviceService.approveDevice(id);
    } catch (err) {
      console.error('Backend approve failed, updating locally:', err);
    }
    setRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'APPROVED' } : r);
      localStorage.setItem('pending_registrations', JSON.stringify(updated.filter(r => r.voucherCode && r.status === 'PENDING')));
      return updated;
    });
    addActivityLog('Approved device request', `Device #${id}`);
  };
  const handleReject = async (id) => {
    try {
      await deviceService.rejectDevice(id);
    } catch (err) {
      console.error('Backend reject failed, updating locally:', err);
    }
    setRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r);
      localStorage.setItem('pending_registrations', JSON.stringify(updated.filter(r => r.voucherCode && r.status === 'PENDING')));
      return updated;
    });
    addActivityLog('Rejected device request', `Device #${id}`);
  };

  const handleSuspend = (userId) => {
    setUsers(prev =>
      prev.map(u => u.id === userId ? { ...u, suspended: !u.suspended, status: u.suspended ? 'Active' : 'Suspended' } : u)
    );
    api.put(`/users/${userId}/disable`).catch(() => {});
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      flashAccessMessage('Cannot delete user: missing user ID. Try refreshing the data.', true);
      return;
    }
    if (!window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      addActivityLog('Deleted user', `User #${userId}`);
      flashAccessMessage('User deleted successfully.');
    } catch (err) {
      console.error('Failed to delete user:', err);
      flashAccessMessage('Failed to delete user. The server may be unavailable.', true);
    }
  };

  const handleSaveSettings = () => {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const addActivityLog = (action, target) => {
    setLogs(prev => [{
      time: 'Just now',
      admin: 'IT Administrator',
      action,
      target,
    }, ...prev]);
  };

  const flashAccessMessage = (message, isError = false) => {
    if (isError) {
      setAccessError(message);
      setAccessSuccess('');
    } else {
      setAccessSuccess(message);
      setAccessError('');
    }
    setTimeout(() => { setAccessError(''); setAccessSuccess(''); }, 3000);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    const schoolId = newStudent.schoolId.trim();
    const name = newStudent.name.trim();
    if (!schoolId || !name) {
      flashAccessMessage('School ID and full name are required.', true);
      return;
    }
    if (users.some(u => u.schoolId === schoolId)) {
      flashAccessMessage('A student with this School ID already exists.', true);
      return;
    }
    setUsers(prev => [...prev, {
      schoolId,
      name,
      devices: 0,
      usage: '0 GB',
      usageRaw: 0,
      status: 'Pending',
      role: 'student',
      suspended: false,
    }]);
    addActivityLog('Added student account', name);
    setNewStudent({ schoolId: '', name: '' });
    setShowAddStudent(false);
    flashAccessMessage(`Student ${name} added successfully.`);
  };

  const handleAddAdmin = (e) => {
    e.preventDefault();
    const name = newAdmin.name.trim();
    const email = newAdmin.email.trim().toLowerCase();
    if (!name || !email) {
      flashAccessMessage('Name and email are required.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flashAccessMessage('Please enter a valid email address.', true);
      return;
    }
    if (admins.some(a => a.email === email)) {
      flashAccessMessage('An admin with this email already exists.', true);
      return;
    }
    const nextId = admins.length ? Math.max(...admins.map(a => a.id)) + 1 : 1;
    setAdmins(prev => [...prev, {
      id: nextId,
      name,
      email,
      role: newAdmin.role,
      lastLogin: 'Never',
      status: 'Active',
    }]);
    addActivityLog('Added new admin', name);
    setNewAdmin({ name: '', email: '', role: 'Admin' });
    setShowAddAdmin(false);
    flashAccessMessage(`Admin ${name} added successfully.`);
  };

  const statusPill = (status) => ({
    padding: '3px 10px', borderRadius: '12px', fontSize: '11px',
    fontWeight: 'bold', fontFamily: FONTS.mono,
    backgroundColor:
      status === 'APPROVED'  ? 'rgba(76,175,80,0.15)'  :
      status === 'PENDING'   ? 'rgba(255,193,7,0.15)'  :
      status === 'Active'    ? 'rgba(76,175,80,0.15)'  :
      status === 'Capped'    ? 'rgba(244,67,54,0.15)'  :
      status === 'Suspended' ? 'rgba(244,67,54,0.15)'  :
      status === 'Inactive'  ? 'rgba(158,158,158,0.15)':
                               'rgba(244,67,54,0.15)',
    color:
      status === 'APPROVED'  ? '#4CAF50' :
      status === 'PENDING'   ? '#FFC107' :
      status === 'Active'    ? '#4CAF50' :
      status === 'Capped'    ? '#F44336' :
      status === 'Suspended' ? '#F44336' :
      status === 'Inactive'  ? '#9E9E9E' :
                               '#F44336',
  });

  const pending  = requests.filter(r => r.status === 'PENDING').length;
  const approved = requests.filter(r => r.status === 'APPROVED').length;
  const filteredRequests = filter === 'ALL' ? requests : requests.filter(r => r.status === filter);

  const inputStyle = {
    padding: '10px 14px',
    border: `1px solid ${COLORS.gold.border}`,
    borderRadius: '8px',
    backgroundColor: 'rgba(61,8,8,0.3)',
    color: COLORS.text.white,
    fontFamily: FONTS.primary,
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: 'bold', color: COLORS.text.mutedGold,
    fontFamily: FONTS.primary, textTransform: 'uppercase',
    letterSpacing: '0.05em', marginBottom: '6px', display: 'block',
  };

  // Usage report bar data
  const reportData = {
    week:  [1.2, 3.4, 2.1, 4.5, 3.8, 2.9, 1.7],
    month: [12, 18, 15, 22, 30, 28, 25, 19, 17, 21, 24, 20],
  };
  const barLabels = {
    week:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };
  const bars   = reportData[reportRange];
  const labels = barLabels[reportRange];
  const maxBar = Math.max(...bars);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: '240px', backgroundColor: COLORS.maroon.dark,
        borderRight: `2px solid ${COLORS.gold.border}`,
        display: 'flex', flexDirection: 'column', height: '100vh',
        position: 'sticky', top: 0, overflowY: 'auto',
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
          <button onClick={onLogout} style={{
            width: '100%', backgroundColor: 'transparent', color: COLORS.text.mutedGold,
            border: `1px solid ${COLORS.gold.border}`, padding: '10px',
            borderRadius: '8px', fontFamily: FONTS.primary, fontSize: '13px', cursor: 'pointer',
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        <header style={{
          backgroundColor: COLORS.maroon.dark, borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
            {SIDEBAR_ITEMS.find(i => i.key === activeKey)?.icon}{' '}
            {SIDEBAR_ITEMS.find(i => i.key === activeKey)?.label}
          </span>
          <span style={{ fontSize: '13px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary }}>
            CITU-Bandwidth Monitoring System · Admin
          </span>
        </header>

        <main style={{ padding: '32px 40px' }}>

          {/* ── NETWORK OVERVIEW ── */}
          {activeKey === 'overview' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {[
                  { label: 'Total Users',     value: users.length, unit: 'accounts', color: COLORS.text.gold },
                  { label: 'Active Devices',  value: 7,       unit: 'devices',  color: '#4CAF50' },
                  { label: 'Pending 2nd Devices', value: pending, unit: 'waiting', color: '#FFC107' },
                  { label: 'Approved Today',  value: approved, unit: 'devices',  color: '#4CAF50' },
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
                  { label: 'This Hour',  value: '120 GB', sub: 'Current throughput' },
                  { label: 'Today',      value: '2.4 TB', sub: 'Daily total usage' },
                  { label: 'This Month', value: '58 TB',  sub: 'Monthly total usage' },
                ].map((item, i) => (
                  <Card key={i} style={{ background: `linear-gradient(135deg, ${COLORS.maroon.medium}, ${COLORS.maroon.light})` }}>
                    <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.mono }}>{item.value}</div>
                    <div style={{ fontSize: '12px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginTop: '4px' }}>{item.sub}</div>
                  </Card>
                ))}
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Top Users by Usage
              </h3>
              <Card style={{ padding: '0' }}>
                {[...MOCK_USERS].sort((a, b) => b.usageRaw - a.usageRaw).map((user, idx) => (
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

          {/* ── ALL USERS ── */}
          {activeKey === 'users' && (
            <>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Registered Students ({users.length})
              </h3>
              <Card style={{ padding: '0' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 100px 100px 80px',
                  padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`,
                  fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted,
                  fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>Student</span><span>School ID</span><span>Devices</span><span>Usage</span><span>Status</span><span>Action</span><span>Delete</span>
                </div>
                {users.map((user, idx) => (
                  <div key={user.schoolId} style={{
                    display: 'grid', gridTemplateColumns: '1.5fr 1fr 80px 80px 100px 100px 80px',
                    padding: '14px 24px',
                    borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, textAlign: 'center' }}>{user.devices}/2</span>
                    <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono }}>{user.usage}</span>
                    <span style={statusPill(user.status)}>{user.status}</span>
                    <button onClick={() => handleSuspend(user.id)} style={{
                      padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                      fontFamily: FONTS.primary, fontWeight: 'bold',
                      backgroundColor: user.suspended ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                      color: user.suspended ? '#4CAF50' : '#F44336',
                      border: user.suspended ? '1px solid rgba(76,175,80,0.4)' : '1px solid rgba(244,67,54,0.4)',
                    }}>
                      {user.suspended ? '✓ Restore' : '⊘ Suspend'}
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} style={{
                      padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                      fontFamily: FONTS.primary, fontWeight: 'bold',
                      backgroundColor: 'rgba(244,67,54,0.15)',
                      color: '#F44336',
                      border: '1px solid rgba(244,67,54,0.4)',
                    }}>
                      🗑 Delete
                    </button>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ── DEVICE REQUESTS ── */}
          {activeKey === 'devices' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
                    Device Registration Requests
                  </h3>
                  <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '4px 0 0' }}>
                    1st use of a voucher is auto-approved · 2nd use of same voucher needs your review
                  </p>
                </div>
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
                      {req.voucherCode && (
                        <div style={{ fontSize: '12px', color: COLORS.text.gold, fontFamily: FONTS.mono, marginTop: '4px' }}>
                          🎫 Voucher: {req.voucherCode}
                        </div>
                      )}
                    </div>
                    <span style={statusPill(req.status)}>{req.status}</span>
                    {req.deviceNo === 1 && req.status === 'APPROVED' && (
                      <span style={{
                        fontSize: '11px', color: COLORS.text.mutedGold,
                        fontFamily: FONTS.primary, fontStyle: 'italic',
                      }}>
                        Auto-approved
                      </span>
                    )}
                    {req.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleApprove(req.id)} style={{
                          padding: '7px 16px', borderRadius: '6px',
                          backgroundColor: 'rgba(76,175,80,0.15)', color: '#4CAF50',
                          fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                          border: '1px solid rgba(76,175,80,0.4)',
                        }}>✓ Approve</button>
                        <button onClick={() => handleReject(req.id)} style={{
                          padding: '7px 16px', borderRadius: '6px',
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

          {/* ── USAGE REPORTS ── */}
          {activeKey === 'reports' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
                  Bandwidth Usage Reports
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['week', 'month'].map(r => (
                    <button key={r} onClick={() => setReportRange(r)} style={{
                      padding: '6px 16px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                      fontFamily: FONTS.primary, fontWeight: reportRange === r ? 'bold' : 'normal',
                      border: `1px solid ${reportRange === r ? COLORS.gold.primary : COLORS.gold.border}`,
                      background: reportRange === r ? 'rgba(212,168,67,0.15)' : 'transparent',
                      color: reportRange === r ? COLORS.text.gold : COLORS.textMuted,
                      textTransform: 'capitalize',
                    }}>{r === 'week' ? 'This Week' : 'This Month'}</button>
                  ))}
                </div>
              </div>

              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '28px' }}>
                {[
                  { label: 'Total Usage',    value: reportRange === 'week' ? '19.6 GB' : '251 GB', icon: '📊' },
                  { label: 'Peak Day',       value: reportRange === 'week' ? 'Thursday' : 'May',    icon: '📈' },
                  { label: 'Avg Per User',   value: reportRange === 'week' ? '3.9 GB'  : '50 GB',  icon: '👤' },
                ].map((s, i) => (
                  <Card key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                    <span style={{ fontSize: '28px' }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.mono }}>{s.value}</div>
                      <div style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{s.label}</div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Bar Chart */}
              <Card style={{ marginBottom: '28px' }}>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px' }}>
                  Bandwidth Usage — {reportRange === 'week' ? 'Daily (GB)' : 'Monthly (GB)'}
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '160px' }}>
                  {bars.map((val, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{val}</div>
                      <div style={{
                        width: '100%',
                        height: `${(val / maxBar) * 120}px`,
                        background: `linear-gradient(180deg, ${COLORS.gold.light}, ${COLORS.gold.primary})`,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                      }} />
                      <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{labels[i]}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Per-user breakdown */}
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Per-User Breakdown
              </h3>
              <Card style={{ padding: '0' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 120px',
                  padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`,
                  fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted,
                  fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>Student</span><span>School ID</span><span>Usage</span><span>Status</span>
                </div>
                {[...MOCK_USERS].sort((a, b) => b.usageRaw - a.usageRaw).map((user, idx) => (
                  <div key={user.schoolId} style={{
                    display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 120px',
                    padding: '14px 24px',
                    borderBottom: idx < MOCK_USERS.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
                    <div>
                      <div style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, marginBottom: '4px' }}>{user.usage}</div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(212,168,67,0.1)', borderRadius: '3px' }}>
                        <div style={{
                          width: `${(user.usageRaw / 5) * 100}%`,
                          height: '100%',
                          background: user.usageRaw >= 5 ? '#F44336' : user.usageRaw >= 4 ? '#FFC107' : COLORS.gold.primary,
                          borderRadius: '3px',
                        }} />
                      </div>
                    </div>
                    <span style={statusPill(user.status)}>{user.status}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ── ACCESS CONTROL ── */}
          {activeKey === 'access' && (
            <>
              {(accessSuccess || accessError) && (
                <div style={{
                  marginBottom: '20px', padding: '14px 20px',
                  backgroundColor: accessError ? 'rgba(244,67,54,0.15)' : 'rgba(76,175,80,0.15)',
                  border: `1px solid ${accessError ? '#F44336' : '#4CAF50'}`,
                  borderRadius: '10px',
                  color: accessError ? '#F44336' : '#4CAF50',
                  fontFamily: FONTS.primary, fontSize: '14px',
                }}>
                  {accessError || accessSuccess}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
                  Student Accounts
                </h3>
                <button
                  type="button"
                  onClick={() => { setShowAddStudent(p => !p); setShowAddAdmin(false); }}
                  style={{
                    padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                    backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                    border: 'none', fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px',
                  }}
                >
                  {showAddStudent ? 'Cancel' : '+ Add Student'}
                </button>
              </div>

              {showAddStudent && (
                <Card style={{ marginBottom: '20px' }}>
                  <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div>
                      <label style={labelStyle}>School ID</label>
                      <input style={inputStyle} placeholder="e.g. 2024-00123" value={newStudent.schoolId}
                        onChange={e => setNewStudent(p => ({ ...p, schoolId: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input style={inputStyle} placeholder="e.g. Juan Dela Cruz" value={newStudent.name}
                        onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <button type="submit" style={{
                      padding: '11px 24px', backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                      border: 'none', borderRadius: '8px', fontFamily: FONTS.primary, fontWeight: 'bold',
                      fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>Save Student</button>
                  </form>
                </Card>
              )}

              <Card style={{ padding: '0', marginBottom: '32px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 80px 100px',
                  padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`,
                  fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted,
                  fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>School ID</span><span>Name</span><span>Devices</span><span>Status</span>
                </div>
                {users.map((user, idx) => (
                  <div key={user.schoolId} style={{
                    display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 80px 100px',
                    padding: '14px 24px',
                    borderBottom: idx < users.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{user.schoolId}</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{user.name}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textBody, fontFamily: FONTS.mono, textAlign: 'center' }}>{user.devices}/2</span>
                    <span style={statusPill(user.status)}>{user.status}</span>
                  </div>
                ))}
              </Card>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: 0 }}>
                  Admin Accounts
                </h3>
                <button
                  type="button"
                  onClick={() => { setShowAddAdmin(p => !p); setShowAddStudent(false); }}
                  style={{
                    padding: '8px 18px', borderRadius: '8px', cursor: 'pointer',
                    backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                    border: 'none', fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px',
                  }}
                >
                  {showAddAdmin ? 'Cancel' : '+ Add Admin'}
                </button>
              </div>

              {showAddAdmin && (
                <Card style={{ marginBottom: '20px' }}>
                  <form onSubmit={handleAddAdmin} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
                    <div>
                      <label style={labelStyle}>Full Name</label>
                      <input style={inputStyle} placeholder="e.g. Jane Admin" value={newAdmin.name}
                        onChange={e => setNewAdmin(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email</label>
                      <input style={inputStyle} type="email" placeholder="e.g. jane@citu.edu.ph" value={newAdmin.email}
                        onChange={e => setNewAdmin(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label style={labelStyle}>Role</label>
                      <select style={inputStyle} value={newAdmin.role}
                        onChange={e => setNewAdmin(p => ({ ...p, role: e.target.value }))}>
                        <option value="Admin">Admin</option>
                        <option value="Support">Support</option>
                        <option value="Super Admin">Super Admin</option>
                      </select>
                    </div>
                    <button type="submit" style={{
                      padding: '11px 24px', backgroundColor: COLORS.gold.primary, color: COLORS.maroon.dark,
                      border: 'none', borderRadius: '8px', fontFamily: FONTS.primary, fontWeight: 'bold',
                      fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap',
                    }}>Save Admin</button>
                  </form>
                </Card>
              )}

              <Card style={{ padding: '0', marginBottom: '32px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px',
                  padding: '12px 24px', borderBottom: `1px solid ${COLORS.gold.border}`,
                  fontSize: '11px', fontWeight: 'bold', color: COLORS.textMuted,
                  fontFamily: FONTS.primary, textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  <span>Name</span><span>Email</span><span>Role</span><span>Last Login</span><span>Status</span>
                </div>
                {admins.map((admin, idx) => (
                  <div key={admin.id} style={{
                    display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr 80px',
                    padding: '14px 24px',
                    borderBottom: idx < admins.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    alignItems: 'center',
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{admin.name}</span>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{admin.email}</span>
                    <span style={{
                      fontSize: '12px', fontWeight: 'bold', fontFamily: FONTS.primary,
                      color: admin.role === 'Super Admin' ? COLORS.gold.primary : COLORS.textBody,
                    }}>{admin.role}</span>
                    <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{admin.lastLogin}</span>
                    <span style={statusPill(admin.status)}>{admin.status}</span>
                  </div>
                ))}
              </Card>

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Activity Logs
              </h3>
              <Card style={{ padding: '0' }}>
                {logs.map((log, idx) => (
                  <div key={idx} style={{
                    padding: '14px 24px',
                    borderBottom: idx < logs.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                    display: 'flex', alignItems: 'center', gap: '16px',
                  }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: COLORS.gold.primary, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                        <strong>{log.admin}</strong> — {log.action}: <span style={{ color: COLORS.textMuted }}>{log.target}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono }}>{log.time}</span>
                  </div>
                ))}
              </Card>
            </>
          )}

          {/* ── ADMIN PANEL ── */}
          {activeKey === 'admin' && (
            <>
              {settingsSaved && (
                <div style={{
                  marginBottom: '24px', padding: '14px 20px',
                  backgroundColor: 'rgba(76,175,80,0.15)', border: '1px solid #4CAF50',
                  borderRadius: '10px', color: '#4CAF50',
                  fontFamily: FONTS.primary, fontSize: '14px',
                }}>
                  ✅ Settings saved successfully!
                </div>
              )}

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                System Settings
              </h3>
              <Card style={{ marginBottom: '28px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label style={labelStyle}>Bandwidth Limit Per User (GB)</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={bandwidthLimit}
                      onChange={e => setBandwidthLimit(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Devices Per Student</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={maxDevices}
                      onChange={e => setMaxDevices(e.target.value)}
                    />
                  </div>

                  {/* Maintenance Mode Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: '1 / -1', padding: '16px', backgroundColor: 'rgba(61,8,8,0.2)', borderRadius: '10px', border: `1px solid ${COLORS.gold.border}` }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>Maintenance Mode</div>
                      <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '2px' }}>Disables student access while maintenance is ongoing</div>
                    </div>
                    <div onClick={() => setMaintenanceMode(p => !p)} style={{
                      width: '52px', height: '28px', borderRadius: '14px', cursor: 'pointer',
                      backgroundColor: maintenanceMode ? '#F44336' : 'rgba(61,8,8,0.6)',
                      border: `1px solid ${maintenanceMode ? '#F44336' : COLORS.gold.border}`,
                      position: 'relative', transition: 'background-color 0.3s',
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: '2px',
                        left: maintenanceMode ? '27px' : '2px',
                        transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                  </div>

                  {/* Auto-reject Toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gridColumn: '1 / -1', padding: '16px', backgroundColor: 'rgba(61,8,8,0.2)', borderRadius: '10px', border: `1px solid ${COLORS.gold.border}` }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>Auto-reject After 7 Days</div>
                      <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '2px' }}>Automatically reject device requests pending over 7 days</div>
                    </div>
                    <div onClick={() => setAutoReject(p => !p)} style={{
                      width: '52px', height: '28px', borderRadius: '14px', cursor: 'pointer',
                      backgroundColor: autoReject ? COLORS.gold.primary : 'rgba(61,8,8,0.6)',
                      border: `1px solid ${autoReject ? COLORS.gold.primary : COLORS.gold.border}`,
                      position: 'relative', transition: 'background-color 0.3s',
                    }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fff',
                        position: 'absolute', top: '2px',
                        left: autoReject ? '27px' : '2px',
                        transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={handleSaveSettings} style={{
                    padding: '11px 28px', backgroundColor: COLORS.gold.primary,
                    color: COLORS.maroon.dark, border: 'none', borderRadius: '8px',
                    fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                  }}>
                    💾 Save Settings
                  </button>
                </div>
              </Card>

              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                Danger Zone
              </h3>
              <Card style={{ border: '1px solid rgba(244,67,54,0.3)' }}>
                {[
                  { label: 'Reset All Bandwidth',   desc: 'Resets weekly bandwidth counters for all students.',  btn: '🔄 Reset Bandwidth',   color: '#FFC107' },
                  { label: 'Clear All Devices',      desc: 'Removes all registered devices from the system.',      btn: '🗑️ Clear Devices',     color: '#F44336' },
                  { label: 'Broadcast Announcement', desc: 'Send a system-wide message to all logged-in users.',   btn: '📢 Broadcast',         color: COLORS.gold.primary },
                ].map((action, i, arr) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 0',
                    borderBottom: i < arr.length - 1 ? `1px solid ${COLORS.gold.border}` : 'none',
                  }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>{action.label}</div>
                      <div style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '2px' }}>{action.desc}</div>
                    </div>
                    <button style={{
                      padding: '9px 20px', borderRadius: '8px', border: `1px solid ${action.color}`,
                      backgroundColor: 'transparent', color: action.color,
                      fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '13px', cursor: 'pointer',
                      whiteSpace: 'nowrap', marginLeft: '24px',
                    }}>
                      {action.btn}
                    </button>
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
