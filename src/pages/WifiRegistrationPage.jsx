/**
 * WifiRegistrationPage.jsx
 *
 * Flow:
 *  Step 1 — Device Info (Brand + Model)
 *  Step 2 — Voucher Entry (school-issued code, max 2 uses)
 *  Step 3 — Verify summary
 *  Step 4 — Connected / Done
 */

import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/authService';
import {
  COLORS,
  FONTS,
  getNextDeviceNumber,
  MAX_DEVICES_PER_STUDENT,
} from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

// ---------------------------------------------------------------------------
// Toast notification sub-component
// ---------------------------------------------------------------------------
function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;
  const bgMap = { success: '#2E7D32', warning: '#E65100', error: '#C62828', info: '#1565C0' };
  const iconMap = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' };
  return (
    <div style={{
      position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
      backgroundColor: bgMap[toast.type] || '#2E7D32',
      color: '#fff', padding: '14px 20px', borderRadius: '12px',
      fontFamily: FONTS.primary, fontSize: '14px', lineHeight: '1.5',
      boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'flex-start', gap: '10px',
      maxWidth: '420px',
      animation: 'toastSlideIn 0.35s ease',
    }}>
      <span style={{ fontSize: '18px', flexShrink: 0 }}>{iconMap[toast.type] || 'ℹ️'}</span>
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button onClick={onDismiss} style={{
        background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
        fontSize: '20px', padding: '0 0 0 8px', lineHeight: '1', flexShrink: 0,
      }}>×</button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mock voucher database  (initial state — mutated via state)
// ---------------------------------------------------------------------------
const INITIAL_VOUCHERS = {
  'CITU-2024-AAAA': { uses: 0, max: 2 },
  'CITU-2024-BBBB': { uses: 1, max: 2 },
  'CITU-2024-CCCC': { uses: 2, max: 2 },
  'CITU-2024-DDDD': { uses: 0, max: 2 },
};

const DEVICE_BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo',
  'Huawei', 'Realme', 'Lenovo', 'Asus', 'HP',
  'Dell', 'Acer', 'Microsoft', 'Other',
];

// ---------------------------------------------------------------------------
// Small reusable helpers
// ---------------------------------------------------------------------------
function StepBar({ step }) {
  const steps = ['Device Info', 'Voucher', 'Verify', 'Connected'];
  return (
    <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
      {steps.map((label, i) => {
        const done    = step > i + 1;
        const current = step === i + 1;
        return (
          <div key={label} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              height: '4px', borderRadius: '2px', marginBottom: '6px',
              backgroundColor: done || current ? COLORS.gold.primary : COLORS.gold.border,
              transition: 'background-color 0.4s ease',
            }} />
            <span style={{
              fontSize: '11px', fontFamily: FONTS.primary,
              color: done || current ? COLORS.gold.primary : COLORS.textMuted,
            }}>
              {done ? '✓ ' : ''}{label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label style={{
      display: 'block', color: COLORS.textHeading,
      fontFamily: FONTS.primary, fontSize: '13px',
      fontWeight: 'bold', marginBottom: '6px',
    }}>
      {children}
    </label>
  );
}

function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <p style={{
      color: '#e53935', fontFamily: FONTS.primary,
      fontSize: '12px', margin: '5px 0 0',
    }}>{msg}</p>
  );
}

function InfoBox({ children }) {
  return (
    <div style={{
      padding: '12px 16px', borderRadius: '8px',
      backgroundColor: 'rgba(212,168,67,0.07)',
      border: `1px solid ${COLORS.gold.border}`,
      fontSize: '13px', color: COLORS.textMuted,
      fontFamily: FONTS.primary, lineHeight: '1.6',
    }}>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '11px 0',
      borderBottom: `1px solid ${COLORS.gold.border}`,
    }}>
      <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{label}</span>
      <span style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.mono, fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
export default function WifiRegistrationPage({ onNavigate, onLogout, userName, userRole }) {
  const [activeMenu, setActiveMenu] = useState('wifi-registration');
  const [step, setStep]             = useState(1);
  const [focusedField, setFocusedField] = useState(null);

  // Step 1 state
  const [brand, setBrand]   = useState('');
  const [model, setModel]   = useState('');
  const [step1Errors, setStep1Errors] = useState({});

  // Step 2 state
  const [voucher, setVoucher]         = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherInfo, setVoucherInfo]   = useState(null);
  const [isChecking, setIsChecking]     = useState(false);

  // Step 3 / 4
  const [isConnecting, setIsConnecting] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [deviceNo, setDeviceNo] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState(null);

  // Connection simulation state
  const [connectionStep, setConnectionStep] = useState(0);
  const [connectionDone, setConnectionDone] = useState(false);

  // Voucher tracking (mutable via state)
  const [vouchers, setVouchers] = useState(INITIAL_VOUCHERS);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch actual device count from backend on mount
  useEffect(() => {
    deviceService.getDevices()
      .then(devices => setRegisteredCount(devices.length))
      .catch(() => {});
  }, []);

  // Advance connection simulation steps
  useEffect(() => {
    if (step !== 4 || connectionDone) return;
    if (connectionStep >= 4) {
      const t = setTimeout(() => setConnectionDone(true), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setConnectionStep(s => s + 1), 900);
    return () => clearTimeout(t);
  }, [step, connectionStep, connectionDone]);

  // ── Navigation ──────────────────────────────────────────────────
  const handleMenuNavigate = (key) => {
    setActiveMenu(key);
    onNavigate(key);
  };

  // ── Step 1: validate device info ────────────────────────────────
  const handleStep1 = (e) => {
    e.preventDefault();
    const errs = {};
    if (!brand) errs.brand = 'Please select a device brand.';
    if (!model.trim()) errs.model = 'Please enter the device model.';
    setStep1Errors(errs);
    if (Object.keys(errs).length === 0) setStep(2);
  };

  // ── Step 2: validate voucher ─────────────────────────────────────
  const handleVoucherSubmit = (e) => {
    e.preventDefault();
    setVoucherError('');

    const code = voucher.trim().toUpperCase();
    if (!code) { setVoucherError('Please enter your voucher code.'); return; }

    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      const record = vouchers[code];

      if (!record) {
        setVoucherError('Invalid voucher code. Please check and try again.');
        return;
      }
      if (record.uses >= record.max) {
        setVoucherError(
          `This voucher has already been used ${record.uses}/${record.max} times and is no longer valid.`
        );
        return;
      }

      const remaining = record.max - record.uses;
      setVoucherInfo({ code, uses: record.uses, max: record.max });
      setStep(3);

      showToast(
        `🎫 Voucher ${code} is valid — ${remaining} use(s) remaining.`,
        'success'
      );
    }, 900);
  };

  // ── Step 3: confirm & connect ────────────────────────────────────
  const handleConfirm = async () => {
    if (registeredCount >= MAX_DEVICES_PER_STUDENT) {
      showToast(
        `⚠️ You have already registered ${MAX_DEVICES_PER_STUDENT} device(s), the maximum allowed per student. Contact the dean's office to reset your registrations.`,
        'error'
      );
      return;
    }

    const code = voucherInfo?.code;
    const record = code ? vouchers[code] : null;
    if (!record) {
      showToast('⚠️ Voucher information is missing. Please go back and re-enter your code.', 'error');
      return;
    }

    // 2nd use of same voucher = requires admin approval
    const needsReview = record.uses >= 1;
    const nextDeviceNo = getNextDeviceNumber(registeredCount);

    setIsConnecting(true);
    try {
      await deviceService.registerDevice({ brand, model });

      // Update voucher use count
      const updatedUses = record.uses + 1;
      setVouchers(prev => ({ ...prev, [code]: { ...prev[code], uses: updatedUses } }));
      setVoucherInfo(prev => prev ? { ...prev, uses: updatedUses } : prev);

      setRegisteredCount(c => c + 1);
      setDeviceNo(nextDeviceNo);
      setRegistrationStatus(needsReview ? 'PENDING' : 'APPROVED');

      // Save pending registration for admin review
      if (needsReview) {
        const pendingReq = {
          id: Date.now(),
          schoolId: userName || 'student',
          name: `${brand} ${model}`,
          brand,
          model,
          voucherCode: code,
          deviceNo: nextDeviceNo,
          status: 'PENDING',
          submitted: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem('pending_registrations') || '[]');
        existing.unshift(pendingReq);
        localStorage.setItem('pending_registrations', JSON.stringify(existing));
      }

      setConnectionStep(1);
      setConnectionDone(false);
      setStep(4);

      // Toast notifications about voucher usage
      const remaining = record.max - updatedUses;
      if (remaining === 0) {
        showToast(
          `✅ Voucher ${code} has reached its maximum uses (${updatedUses}/${record.max}). No more devices can be registered with it.`,
          'warning'
        );
      } else {
        showToast(
          `✅ Voucher ${code} used successfully — ${remaining} use(s) remaining.`,
          'success'
        );
      }
    } catch (err) {
      console.error('Device registration failed:', err);
      showToast('❌ Registration failed. Please try again.', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleReset = () => {
    if (registeredCount >= MAX_DEVICES_PER_STUDENT) return;
    setBrand(''); setModel(''); setVoucher('');
    setVoucherInfo(null); setVoucherError('');
    setStep1Errors({}); setDeviceNo(null); setRegistrationStatus(null);
    setConnectionStep(0); setConnectionDone(false);
    setStep(1);
  };

  // ── Shared input style ───────────────────────────────────────────
  const inputStyle = (field, hasError) => ({
    width: '100%',
    padding: '11px 14px',
    backgroundColor: COLORS.bgInput,
    border: `2px solid ${
      hasError          ? '#e53935' :
      focusedField === field ? COLORS.gold.primary :
                          COLORS.gold.border
    }`,
    borderRadius: '8px',
    color: COLORS.maroon.card,
    fontFamily: FONTS.mono,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.25s ease',
    boxSizing: 'border-box',
  });

  const btnPrimary = (disabled) => ({
    width: '100%', padding: '13px',
    backgroundColor: disabled ? COLORS.gold.border : COLORS.gold.primary,
    color: COLORS.maroon.dark, border: 'none',
    borderRadius: '8px', fontFamily: FONTS.primary,
    fontWeight: 'bold', fontSize: '15px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 0.25s ease',
  });

  const btnSecondary = {
    padding: '11px 24px', backgroundColor: 'transparent',
    color: COLORS.textMuted,
    border: `1px solid ${COLORS.gold.border}`,
    borderRadius: '8px', fontFamily: FONTS.primary,
    fontSize: '14px', cursor: 'pointer',
  };

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes connPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.2); }
        }
      `}</style>
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      <DashboardSidebar
        activeKey={activeMenu}
        onNavigate={handleMenuNavigate}
        onLogout={onLogout}
        userName={userName}
        userRole={userRole}
      />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        {/* Header */}
        <header style={{
          backgroundColor: COLORS.maroon.dark,
          borderBottom: `2px solid ${COLORS.gold.border}`,
          padding: '18px 40px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '26px' }}>📶</span>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              WiFi Registration
            </span>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
            {userName}
          </span>
        </header>

        <main style={{ padding: '40px', maxWidth: '640px', margin: '0 auto' }}>

          {/* ── STEPS 1–3: Card form ── */}
          {step <= 3 && (
            <Card>
              {registeredCount >= MAX_DEVICES_PER_STUDENT && (
                <div style={{
                  backgroundColor: '#FFF3E0', border: '1px solid #E65100', borderRadius: '8px',
                  padding: '12px 16px', marginBottom: '20px',
                  fontSize: '13px', fontFamily: FONTS.primary, color: '#BF360C', lineHeight: '1.5',
                }}>
                  <strong>⚠️ Maximum devices reached.</strong> You have already registered{' '}
                  {MAX_DEVICES_PER_STUDENT} device(s). Contact the dean's office to reset your registrations.
                </div>
              )}
              <StepBar step={step} />

              {/* ═══ STEP 1: Device Info ═══ */}
              {step === 1 && (
                <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>
                      Device Information
                    </h2>
                    <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                      Enter the brand and model of the device you want to connect to <strong>CITU-WIFI</strong>.
                    </p>
                  </div>

                  {/* Brand */}
                  <div>
                    <FieldLabel>Device Brand</FieldLabel>
                    <select
                      value={brand}
                      onChange={e => { setBrand(e.target.value); setStep1Errors(p => ({ ...p, brand: '' })); }}
                      onFocus={() => setFocusedField('brand')}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle('brand', !!step1Errors.brand)}
                    >
                      <option value="">— Select brand —</option>
                      {DEVICE_BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ErrorMsg msg={step1Errors.brand} />
                  </div>

                  {/* Model */}
                  <div>
                    <FieldLabel>Device Model</FieldLabel>
                    <input
                      type="text"
                      value={model}
                      placeholder="e.g. iPhone 14, Galaxy S23, Vivobook 15"
                      onChange={e => { setModel(e.target.value); setStep1Errors(p => ({ ...p, model: '' })); }}
                      onFocus={() => setFocusedField('model')}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle('model', !!step1Errors.model)}
                    />
                    <ErrorMsg msg={step1Errors.model} />
                  </div>

                  <InfoBox>
                    ℹ️ You may register up to <strong>2 devices</strong> per account.
                    Your <strong>1st device</strong> is registered immediately.
                    Your <strong>2nd device</strong> is sent to an admin for approval before it can connect.
                  </InfoBox>

                  <button type="submit" style={btnPrimary(false)}>
                    Next: Enter Voucher →
                  </button>
                </form>
              )}

              {/* ═══ STEP 2: Voucher Entry ═══ */}
              {step === 2 && (
                <form onSubmit={handleVoucherSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>
                      Enter Your Voucher
                    </h2>
                    <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                      Use the voucher code issued by the CITU IT Office. Each voucher can be used a <strong>maximum of 2 times</strong>.
                    </p>
                  </div>

                  {/* Device reminder pill */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 14px', borderRadius: '8px',
                    backgroundColor: 'rgba(212,168,67,0.07)',
                    border: `1px solid ${COLORS.gold.border}`,
                  }}>
                    <span style={{ fontSize: '20px' }}>{brand === 'Apple' ? '📱' : '💻'}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: COLORS.textBody, fontFamily: FONTS.primary }}>
                        {brand} {model}
                      </div>
                      <div style={{ fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>
                        Device to be registered
                      </div>
                    </div>
                  </div>

                  {/* Voucher input */}
                  <div>
                    <FieldLabel>Voucher Code</FieldLabel>
                    <input
                      type="text"
                      value={voucher}
                      placeholder="e.g. CITU-2024-XXXX"
                      onChange={e => { setVoucher(e.target.value.toUpperCase()); setVoucherError(''); }}
                      onFocus={() => setFocusedField('voucher')}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...inputStyle('voucher', !!voucherError),
                        letterSpacing: '2px',
                        fontSize: '16px',
                        textTransform: 'uppercase',
                      }}
                      maxLength={18}
                    />
                    <ErrorMsg msg={voucherError} />
                  </div>

                  {/* Usage limit notice */}
                  <InfoBox>
                    🎫 Voucher usage limit: <strong>2 devices per voucher</strong>.<br />
                    Once the limit is reached, the voucher becomes invalid.<br />
                    Contact <strong>it.support@citu.edu.ph</strong> for a new voucher.
                  </InfoBox>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={() => setStep(1)} style={btnSecondary}>
                      ← Back
                    </button>
                    <button type="submit" disabled={isChecking} style={{ ...btnPrimary(isChecking), flex: 1 }}>
                      {isChecking ? 'Validating...' : 'Validate Voucher →'}
                    </button>
                  </div>
                </form>
              )}

              {/* ═══ STEP 3: Verify Summary ═══ */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, margin: '0 0 4px' }}>
                      Confirm Registration
                    </h2>
                    <p style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                      Please review the details below before connecting.
                    </p>
                  </div>

                  {/* Summary table */}
                  <div style={{
                    backgroundColor: COLORS.bgSection,
                    border: `1px solid ${COLORS.gold.border}`,
                    borderRadius: '10px', padding: '4px 20px 8px',
                  }}>
                    <SummaryRow label="Device Brand"  value={brand} />
                    <SummaryRow label="Device Model"  value={model} />
                    <SummaryRow label="Network"       value="CITU-WIFI" />
                    <SummaryRow label="Voucher Code"  value={voucherInfo?.code} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0' }}>
                      <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>Voucher Uses</span>
                      <span style={{
                        fontSize: '13px', fontFamily: FONTS.mono, fontWeight: 'bold',
                        color: voucherInfo?.uses + 1 >= voucherInfo?.max ? '#FFC107' : '#4CAF50',
                      }}>
                        {voucherInfo?.uses + 1} / {voucherInfo?.max} used after this
                      </span>
                    </div>
                  </div>

                  <InfoBox>
                    {voucherInfo?.uses >= 1 ? (
                      <>
                        🎫 This voucher has been used <strong>{voucherInfo.uses} time(s)</strong> already.
                        This registration will be <strong>submitted for admin review</strong> before it can connect.
                      </>
                    ) : (
                      <>
                        ✅ This is the <strong>first use</strong> of this voucher code.
                        Your device will be <strong>auto-approved</strong> when you confirm.
                      </>
                    )}
                  </InfoBox>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} style={btnSecondary}>← Back</button>
                    <button
                      onClick={handleConfirm}
                      disabled={isConnecting}
                      style={{
                        ...btnPrimary(isConnecting), flex: 2,
                        backgroundColor: isConnecting ? COLORS.gold.border :
                          voucherInfo?.uses >= 1 ? '#E65100' : COLORS.gold.primary,
                      }}
                    >
                      {isConnecting
                        ? (voucherInfo?.uses >= 1 ? 'Submitting...' : 'Connecting...')
                        : (voucherInfo?.uses >= 1 ? '📨 Submit for Review' : '✓ Confirm & Connect')
                      }
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ═══ STEP 4: Connection Simulation + Result ═══ */}
          {step === 4 && (
            <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
              {!connectionDone ? (
                <>
                  {/* ── Connecting Animation ── */}
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    border: `4px solid ${COLORS.gold.border}`,
                    borderTopColor: COLORS.gold.primary,
                    margin: '0 auto 20px',
                    animation: 'connSpin 0.8s linear infinite',
                  }} />
                  <style>{`
                    @keyframes connSpin { to { transform: rotate(360deg); } }
                  `}</style>

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: '14px',
                    maxWidth: '360px', margin: '0 auto 12px',
                  }}>
                    {[
                      { icon: '🔍', text: 'Scanning network...' },
                      { icon: '🎫', text: 'Verifying voucher...' },
                      { icon: '📡', text: 'Assigning IP address...' },
                      { icon: '🔗', text: 'Connecting to CITU-WIFI...' },
                      { icon: registrationStatus === 'PENDING' ? '📨' : '✅',
                        text: registrationStatus === 'PENDING' ? 'Request submitted!' : 'Connected!' },
                    ].map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '8px 16px', borderRadius: '8px',
                        backgroundColor: connectionStep > i ? 'rgba(76,175,80,0.1)' :
                                        connectionStep === i ? 'rgba(212,168,67,0.12)' : 'transparent',
                        border: `1px solid ${
                          connectionStep > i ? 'rgba(76,175,80,0.3)' :
                          connectionStep === i ? COLORS.gold.border : 'transparent'
                        }`,
                        opacity: connectionStep >= i ? 1 : 0.3,
                        transition: 'all 0.4s ease',
                      }}>
                        <span style={{
                          fontSize: '20px',
                          animation: connectionStep === i ? 'connPulse 1s ease infinite' : 'none',
                        }}>{item.icon}</span>
                        <span style={{
                          fontSize: '14px', fontFamily: FONTS.primary,
                          color: connectionStep > i ? '#4CAF50' :
                                 connectionStep === i ? COLORS.text.gold : COLORS.textMuted,
                          fontWeight: connectionStep >= i ? 'bold' : 'normal',
                        }}>{item.text}</span>
                        {connectionStep > i && (
                          <span style={{ marginLeft: 'auto', color: '#4CAF50', fontSize: '16px' }}>✓</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <p style={{
                    fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.mono,
                    marginTop: '8px',
                  }}>
                    {connectionStep < 4 ? `Step ${connectionStep} of 4` : 'Finalizing...'}
                  </p>
                </>
              ) : (
                <>
                  {/* ── Result Screen ── */}
                  <div style={{ fontSize: '72px', marginBottom: '16px' }}>
                    {registrationStatus === 'PENDING' ? '⏳' : '✅'}
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '10px' }}>
                    {registrationStatus === 'PENDING' ? 'Submitted for Admin Review' : 'Device Registered!'}
                  </h2>
                  <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, lineHeight: '1.7', marginBottom: '28px' }}>
                    {registrationStatus === 'PENDING' ? (
                      <>
                        Your <strong style={{ color: COLORS.textBody }}>{brand} {model}</strong> (Device #{deviceNo}) has been
                        submitted. An administrator will review your <strong>2nd device</strong> before it can join{' '}
                        <strong style={{ color: COLORS.textBody }}>CITU-WIFI</strong>.
                      </>
                    ) : (
                      <>
                        Your <strong style={{ color: COLORS.textBody }}>{brand} {model}</strong> (Device #{deviceNo}) is now
                        connected to <strong style={{ color: COLORS.textBody }}>CITU-WIFI</strong>.
                      </>
                    )}
                    <br />
                    Voucher <strong style={{ color: COLORS.textBody, fontFamily: FONTS.mono }}>{voucherInfo?.code}</strong> has
                    been used ({voucherInfo?.uses}/{voucherInfo?.max}).
                  </p>

                  {/* Summary pills */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
                    {[
                      { icon: '📶', label: 'CITU-WIFI' },
                      { icon: '⚡', label: '5 GB / month' },
                      { icon: '🔒', label: 'Encrypted' },
                      { icon: '📱', label: `${brand} ${model}` },
                    ].map(({ icon, label }) => (
                      <div key={label} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 14px',
                        backgroundColor: COLORS.bgSection,
                        border: `1px solid ${COLORS.gold.border}`,
                        borderRadius: '20px',
                        fontSize: '12px', color: COLORS.textBody, fontFamily: FONTS.primary,
                      }}>
                        {icon} {label}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    {registeredCount < MAX_DEVICES_PER_STUDENT && (
                    <button onClick={handleReset} style={btnSecondary}>
                      Register Another Device
                    </button>
                    )}
                    <button
                      onClick={() => onNavigate('dashboard')}
                      style={{
                        padding: '12px 28px', backgroundColor: COLORS.gold.primary,
                        border: 'none', borderRadius: '8px', color: COLORS.maroon.dark,
                        fontFamily: FONTS.primary, fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
                      }}
                    >
                      Go to Dashboard →
                    </button>
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Test voucher hint (remove in production) */}
          {step === 2 && (
            <p style={{
              textAlign: 'center', marginTop: '16px',
              fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono,
            }}>
              🧪 {Object.entries(vouchers).map(([code, rec]) =>
                `${code} (${rec.uses}/${rec.max})`
              ).join(' · ')}
            </p>
          )}

        </main>
      </div>
    </div>
    </>
  );
}
