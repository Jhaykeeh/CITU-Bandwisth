/**
 * WifiRegistrationPage.jsx
 *
 * Flow:
 *  Step 1 — Device Info (Brand + Model)
 *  Step 2 — Voucher Entry (school-issued code, max 2 uses)
 *  Step 3 — Verify summary
 *  Step 4 — Connected / Done
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';

// ---------------------------------------------------------------------------
// Mock voucher database  (in a real app this lives on the server)
// ---------------------------------------------------------------------------
const VALID_VOUCHERS = {
  'CITU-2024-AAAA': { uses: 0, max: 2 },
  'CITU-2024-BBBB': { uses: 1, max: 2 },
  'CITU-2024-CCCC': { uses: 2, max: 2 }, // already full
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
  const [voucherInfo, setVoucherInfo]   = useState(null); // resolved voucher record
  const [isChecking, setIsChecking]     = useState(false);

  // Step 3 / 4
  const [isConnecting, setIsConnecting] = useState(false);

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
      const record = VALID_VOUCHERS[code];

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

      setVoucherInfo({ code, uses: record.uses, max: record.max });
      setStep(3);
    }, 900);
  };

  // ── Step 3: confirm & connect ────────────────────────────────────
  const handleConfirm = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep(4);
    }, 1400);
  };

  const handleReset = () => {
    setBrand(''); setModel(''); setVoucher('');
    setVoucherInfo(null); setVoucherError('');
    setStep1Errors({}); setStep(1);
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
                    Each device requires a valid school-issued voucher.
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
                    ✅ Voucher is valid. Clicking <strong>Confirm & Connect</strong> will register your device
                    and consume one voucher use.
                  </InfoBox>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setStep(2)} style={btnSecondary}>← Back</button>
                    <button
                      onClick={handleConfirm}
                      disabled={isConnecting}
                      style={{ ...btnPrimary(isConnecting), flex: 2 }}
                    >
                      {isConnecting ? 'Connecting...' : '✓ Confirm & Connect'}
                    </button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ═══ STEP 4: Connected / Done ═══ */}
          {step === 4 && (
            <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontSize: '72px', marginBottom: '16px' }}>✅</div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '10px' }}>
                Device Registered!
              </h2>
              <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, lineHeight: '1.7', marginBottom: '28px' }}>
                Your <strong style={{ color: COLORS.textBody }}>{brand} {model}</strong> has been
                successfully registered to <strong style={{ color: COLORS.textBody }}>CITU-WIFI</strong>.<br />
                Voucher <strong style={{ color: COLORS.textBody, fontFamily: FONTS.mono }}>{voucherInfo?.code}</strong> has
                been used ({voucherInfo?.uses + 1}/{voucherInfo?.max}).
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
                <button onClick={handleReset} style={btnSecondary}>
                  Register Another Device
                </button>
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
            </Card>
          )}

          {/* Test voucher hint (remove in production) */}
          {step === 2 && (
            <p style={{
              textAlign: 'center', marginTop: '16px',
              fontSize: '11px', color: COLORS.textMuted, fontFamily: FONTS.mono,
            }}>
              🧪 Test codes: CITU-2024-AAAA (0/2) · CITU-2024-BBBB (1/2) · CITU-2024-CCCC (full)
            </p>
          )}

        </main>
      </div>
    </div>
  );
}