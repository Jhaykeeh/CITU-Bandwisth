/**
 * MyAccount Component
 *
 * Account management page with profile info, account details,
 * password change, and notification preferences.
 * Follows the DashboardPage UI conventions (maroon/gold theme).
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

export default function MyAccount({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('my-account');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [profile, setProfile] = useState({
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@wildcats.edu.ph',
    studentId: '2021-00123',
    course: 'BS Computer Science',
    year: '3rd Year',
    contactNumber: '+63 912 345 6789',
  });

  const [profileDraft, setProfileDraft] = useState({ ...profile });

  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    bandwidthAlerts: true,
    deviceConnects: true,
    systemUpdates: false,
    loginAlerts: true,
  });

  const handleMenuNavigate = (key) => {
    if (key === 'my-account') {
      setActiveMenu(key);
      return;
    }

    // Other sidebar items currently live on the dashboard.
    onNavigate('dashboard');
  };

  const handleProfileSave = () => {
    setSavingProfile(true);
    setTimeout(() => {
      setProfile({ ...profileDraft });
      setEditingProfile(false);
      setSavingProfile(false);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const handleProfileCancel = () => {
    setProfileDraft({ ...profile });
    setEditingProfile(false);
  };

  const handlePasswordSave = () => {
    if (passwords.newPass !== passwords.confirm) {
      alert('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setPasswords({ current: '', newPass: '', confirm: '' });
      setEditingPassword(false);
      setSavingPassword(false);
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 800);
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    backgroundColor: 'rgba(61,8,8,0.5)',
    border: `1px solid ${COLORS.gold.border}`,
    borderRadius: '8px',
    color: COLORS.text?.white || '#fff',
    fontFamily: FONTS.primary,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '12px',
    color: COLORS.text?.mutedGold || '#c9a84c',
    fontFamily: FONTS.primary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
    display: 'block',
  };

  const valueStyle = {
    fontSize: '15px',
    color: COLORS.text?.white || '#fff',
    fontFamily: FONTS.primary,
    padding: '10px 0',
    borderBottom: `1px solid rgba(212,168,67,0.15)`,
  };

  const btnPrimary = {
    padding: '10px 24px',
    backgroundColor: COLORS.gold?.primary || '#D4A843',
    color: COLORS.maroon?.dark || '#3D0808',
    border: 'none',
    borderRadius: '8px',
    fontFamily: FONTS.primary,
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const btnSecondary = {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: COLORS.text?.mutedGold || '#c9a84c',
    border: `1px solid ${COLORS.gold?.border || '#c9a84c'}`,
    borderRadius: '8px',
    fontFamily: FONTS.primary,
    fontSize: '14px',
    cursor: 'pointer',
  };

  const notificationLabels = {
    bandwidthAlerts: { label: 'Bandwidth Alerts', desc: 'Notify when you reach 80% of your daily allocation' },
    deviceConnects: { label: 'Device Connections', desc: 'Notify when a new device connects to your account' },
    systemUpdates: { label: 'System Updates', desc: 'Receive notifications about system maintenance and updates' },
    loginAlerts: { label: 'Login Alerts', desc: 'Notify on successful logins to your account' },
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon?.dark || '#3D0808' }}>
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
            backgroundColor: COLORS.maroon?.dark || '#3D0808',
            borderBottom: `2px solid ${COLORS.gold?.border || '#c9a84c'}`,
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
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text?.gold || '#D4A843', fontFamily: FONTS.primary }}>
              WildConnect
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: COLORS.text?.mutedGold || '#c9a84c', fontFamily: FONTS.primary }}>
              Welcome back,
            </span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text?.gold || '#D4A843', fontFamily: FONTS.primary }}>
              {userName}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '40px' }}>

          {/* Page Title Banner */}
          <Card style={{
            marginBottom: '32px',
            background: `linear-gradient(135deg, ${COLORS.maroon?.medium || '#6B1A1A'} 0%, ${COLORS.maroon?.light || '#8B2222'} 100%)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Avatar */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.gold?.primary || '#D4A843'}, ${COLORS.gold?.light || '#f0c84a'})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: COLORS.maroon?.dark || '#3D0808',
                  fontFamily: FONTS.primary,
                  flexShrink: 0,
                  border: `3px solid ${COLORS.gold?.primary || '#D4A843'}`,
                }}
              >
                {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
              </div>
              <div>
                <h2 style={{
                  fontSize: '28px', fontWeight: 'bold',
                  color: COLORS.text?.gold || '#D4A843',
                  fontFamily: FONTS.primary, marginBottom: '4px',
                }}>
                  {profile.firstName} {profile.lastName}
                </h2>
                <p style={{ fontSize: '14px', color: COLORS.text?.white || '#fff', fontFamily: FONTS.primary, margin: '0 0 2px 0' }}>
                  {profile.course} · {profile.year}
                </p>
                <p style={{ fontSize: '13px', color: COLORS.text?.mutedGold || '#c9a84c', fontFamily: FONTS.primary, margin: 0 }}>
                  Student ID: {profile.studentId}
                </p>
              </div>
            </div>
          </Card>

          {/* Success Toast */}
          {successMsg && (
            <div
              style={{
                marginBottom: '24px',
                padding: '14px 20px',
                backgroundColor: 'rgba(76,175,80,0.15)',
                border: '1px solid #4CAF50',
                borderRadius: '10px',
                color: '#4CAF50',
                fontFamily: FONTS.primary,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              ✅ {successMsg}
            </div>
          )}

          {/* Profile Information */}
          <h3 style={{
            fontSize: '24px', fontWeight: 'bold',
            color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px',
          }}>
            Profile Information
          </h3>
          <Card style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary }}>
                👤 Personal Details
              </span>
              {!editingProfile ? (
                <button style={btnPrimary} onClick={() => setEditingProfile(true)}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={btnSecondary} onClick={handleProfileCancel}>Cancel</button>
                  <button style={btnPrimary} onClick={handleProfileSave} disabled={savingProfile}>
                    {savingProfile ? 'Saving…' : '💾 Save Changes'}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {[
                { field: 'firstName', label: 'First Name' },
                { field: 'lastName', label: 'Last Name' },
                { field: 'email', label: 'Email Address' },
                { field: 'studentId', label: 'Student ID', readOnly: true },
                { field: 'course', label: 'Course' },
                { field: 'year', label: 'Year Level' },
                { field: 'contactNumber', label: 'Contact Number' },
              ].map(({ field, label, readOnly }) => (
                <div key={field}>
                  <label style={labelStyle}>{label}</label>
                  {editingProfile && !readOnly ? (
                    <input
                      style={inputStyle}
                      value={profileDraft[field]}
                      onChange={(e) => setProfileDraft((prev) => ({ ...prev, [field]: e.target.value }))}
                    />
                  ) : (
                    <div style={valueStyle}>{profile[field]}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Change Password */}
          <h3 style={{
            fontSize: '24px', fontWeight: 'bold',
            color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px',
          }}>
            Security
          </h3>
          <Card style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary }}>
                🔒 Change Password
              </span>
              {!editingPassword ? (
                <button style={btnPrimary} onClick={() => setEditingPassword(true)}>
                  🔑 Change Password
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={btnSecondary} onClick={() => { setEditingPassword(false); setPasswords({ current: '', newPass: '', confirm: '' }); }}>
                    Cancel
                  </button>
                  <button style={btnPrimary} onClick={handlePasswordSave} disabled={savingPassword}>
                    {savingPassword ? 'Saving…' : '💾 Update Password'}
                  </button>
                </div>
              )}
            </div>

            {!editingPassword ? (
              <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                Your password was last changed 30 days ago. We recommend updating it regularly to keep your account secure.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={passwords.current}
                    placeholder="Enter current password"
                    onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={passwords.newPass}
                    placeholder="Enter new password"
                    onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={passwords.confirm}
                    placeholder="Confirm new password"
                    onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Notification Preferences */}
          <h3 style={{
            fontSize: '24px', fontWeight: 'bold',
            color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px',
          }}>
            Notification Preferences
          </h3>
          <Card style={{ padding: '0' }}>
            {Object.entries(notificationLabels).map(([key, { label, desc }], idx, arr) => (
              <div
                key={key}
                style={{
                  padding: '20px 24px',
                  borderBottom: idx < arr.length - 1 ? `1px solid ${COLORS.gold?.border || '#c9a84c'}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary, marginBottom: '4px' }}>
                    {label}
                  </div>
                  <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0, lineHeight: '1.5' }}>
                    {desc}
                  </p>
                </div>

                {/* Toggle Switch */}
                <div
                  onClick={() => toggleNotification(key)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    backgroundColor: notifications[key] ? (COLORS.gold?.primary || '#D4A843') : 'rgba(61,8,8,0.6)',
                    border: `1px solid ${notifications[key] ? (COLORS.gold?.primary || '#D4A843') : (COLORS.gold?.border || '#c9a84c')}`,
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      top: '2px',
                      left: notifications[key] ? '27px' : '2px',
                      transition: 'left 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  />
                </div>
              </div>
            ))}
          </Card>

          {/* Account Actions */}
          <h3 style={{
            fontSize: '24px', fontWeight: 'bold',
            color: COLORS.textHeading, fontFamily: FONTS.primary,
            marginBottom: '20px', marginTop: '32px',
          }}>
            Account Actions
          </h3>
          <Card>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                style={{ ...btnSecondary, display: 'flex', alignItems: 'center', gap: '8px' }}
                onClick={onLogout}
              >
                🚪 Sign Out
              </button>
              <button
                style={{
                  ...btnSecondary,
                  color: '#e57373',
                  borderColor: '#e57373',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🗑️ Delete Account
              </button>
            </div>
            <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginTop: '12px', marginBottom: 0 }}>
              Deleting your account is permanent and will remove all your data, registered devices, and usage history.
            </p>
          </Card>

        </main>
      </div>
    </div>
  );
}