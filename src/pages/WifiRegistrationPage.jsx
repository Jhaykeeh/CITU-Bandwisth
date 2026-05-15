import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import DashboardSidebar from '../components/DashboardSidebar';
import Card from '../components/Card';
import ScannerToggle from '../components/ScannerToggle';
import { QRCodeSVG } from 'qrcode.react';

export default function WifiRegistrationPage({ onNavigate, onLogout, userName }) {
  const [activeMenu, setActiveMenu] = useState('wifi-registration');
  const [mode, setMode] = useState('scanner');
  const [manualId, setManualId] = useState('');
  const [scannedId, setScannedId] = useState('');
  const [step, setStep] = useState('scan');   // 'scan' | 'verify' | 'done'
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuNavigate = (key) => {
    setActiveMenu(key);
    onNavigate(key);
  };

  const handleScan = () => {
    // Simulate a QR scan result
    const fakeId = 'CITU-2021-' + Math.floor(10000 + Math.random() * 90000);
    setScannedId(fakeId);
    setStep('verify');
  };

  const handleManualSubmit = () => {
    if (!manualId.trim()) return;
    setScannedId(manualId.trim());
    setStep('verify');
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('done');
    }, 1200);
  };

  const handleReset = () => {
    setManualId('');
    setScannedId('');
    setStep('scan');
    setMode('scanner');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: COLORS.maroon.dark }}>
      <DashboardSidebar
        activeKey={activeMenu}
        onNavigate={handleMenuNavigate}
        onLogout={onLogout}
        userName={userName}
      />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: COLORS.bgSection }}>
        {/* Header */}
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
            <span style={{ fontSize: '28px' }}>📶</span>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
              WiFi Registration
            </span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
            {userName}
          </span>
        </header>

        <main style={{ padding: '40px', maxWidth: '700px', margin: '0 auto' }}>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {['Scan / Enter ID', 'Verify', 'Connected'].map((label, i) => {
              const stepIndex = { scan: 0, verify: 1, done: 2 }[step];
              const active = stepIndex >= i;
              return (
                <div key={label} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: '4px',
                    borderRadius: '2px',
                    backgroundColor: active ? COLORS.gold.primary : COLORS.gold.border,
                    marginBottom: '8px',
                    transition: 'background-color 0.4s ease',
                  }} />
                  <span style={{
                    fontSize: '12px',
                    fontFamily: FONTS.primary,
                    color: active ? COLORS.gold.primary : COLORS.textMuted,
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── STEP 1: Scan or Manual ── */}
          {step === 'scan' && (
            <Card>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '20px' }}>
                Register Your Device
              </h2>

              <ScannerToggle mode={mode} onToggle={setMode} />

              <div style={{ marginTop: '28px' }}>
                {mode === 'scanner' ? (
                  <div style={{ textAlign: 'center' }}>
                    {/* QR preview — shows a sample QR the user would scan */}
                    <div style={{
                      display: 'inline-block',
                      padding: '20px',
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      border: `2px solid ${COLORS.gold.border}`,
                      marginBottom: '20px',
                    }}>
                      <QRCodeSVG value="CITU-SAMPLE-ID" size={160} />
                    </div>
                    <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginBottom: '24px' }}>
                      Point your camera at your CITU student ID QR code, or click below to simulate a scan.
                    </p>
                    <button
                      onClick={handleScan}
                      style={{
                        backgroundColor: COLORS.gold.primary,
                        color: COLORS.maroon.dark,
                        border: 'none',
                        padding: '14px 32px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: FONTS.primary,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      📷 Simulate Scan
                    </button>
                  </div>
                ) : (
                  <div>
                    <label style={{
                      display: 'block',
                      color: COLORS.textHeading,
                      fontFamily: FONTS.primary,
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                    }}>
                      Student / Staff ID
                    </label>
                    <input
                      type="text"
                      value={manualId}
                      placeholder="e.g. CITU-2021-12345"
                      onChange={(e) => setManualId(e.target.value)}
                      onFocus={() => setFocusedField('manualId')}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        backgroundColor: COLORS.bgInput,
                        border: `2px solid ${focusedField === 'manualId' ? COLORS.gold.primary : COLORS.gold.border}`,
                        borderRadius: '8px',
                        color: COLORS.maroon.dark,
                        fontFamily: FONTS.mono,
                        fontSize: '16px',
                        outline: 'none',
                        marginBottom: '20px',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.3s ease',
                      }}
                    />
                    <button
                      onClick={handleManualSubmit}
                      disabled={!manualId.trim()}
                      style={{
                        backgroundColor: manualId.trim() ? COLORS.gold.primary : COLORS.gold.border,
                        color: COLORS.maroon.dark,
                        border: 'none',
                        padding: '14px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        fontFamily: FONTS.primary,
                        borderRadius: '8px',
                        cursor: manualId.trim() ? 'pointer' : 'not-allowed',
                        width: '100%',
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      Submit ID →
                    </button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── STEP 2: Verify ── */}
          {step === 'verify' && (
            <Card>
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '8px' }}>
                Verify Your Identity
              </h2>
              <p style={{ fontSize: '14px', color: COLORS.textMuted, fontFamily: FONTS.primary, marginBottom: '28px' }}>
                Confirm that the details below are correct before connecting.
              </p>

              {/* ID card preview */}
              <div style={{
                backgroundColor: COLORS.bgSection,
                border: `1px solid ${COLORS.gold.border}`,
                borderRadius: '10px',
                padding: '20px 24px',
                marginBottom: '28px',
              }}>
                {[
                  { label: 'Detected ID', value: scannedId },
                  { label: 'Name', value: userName },
                  { label: 'Network', value: 'CITU-WildConnect-5G' },
                  { label: 'Device MAC', value: 'A4:C3:F0:' + Math.floor(100000 + Math.random() * 900000) },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: `1px solid ${COLORS.gold.border}`,
                  }}>
                    <span style={{ fontSize: '13px', color: COLORS.textMuted, fontFamily: FONTS.primary }}>{label}</span>
                    <span style={{ fontSize: '14px', color: COLORS.textBody, fontFamily: FONTS.mono, fontWeight: 'bold' }}>{value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '13px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${COLORS.gold.border}`,
                    borderRadius: '8px',
                    color: COLORS.textMuted,
                    fontFamily: FONTS.primary,
                    fontSize: '15px',
                    cursor: 'pointer',
                  }}
                >
                  ← Rescan
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    padding: '13px',
                    backgroundColor: isLoading ? COLORS.gold.border : COLORS.gold.primary,
                    border: 'none',
                    borderRadius: '8px',
                    color: COLORS.maroon.dark,
                    fontFamily: FONTS.primary,
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                >
                  {isLoading ? 'Connecting…' : '✓ Confirm & Connect'}
                </button>
              </div>
            </Card>
          )}

          {/* ── STEP 3: Done ── */}
          {step === 'done' && (
            <Card style={{ textAlign: 'center', padding: '48px 32px' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '12px' }}>
                You're Connected!
              </h2>
              <p style={{ fontSize: '15px', color: COLORS.textMuted, fontFamily: FONTS.primary, lineHeight: '1.7', marginBottom: '32px' }}>
                Device <strong style={{ color: COLORS.textBody }}>{scannedId}</strong> has been registered to{' '}
                <strong style={{ color: COLORS.textBody }}>CITU-WildConnect-5G</strong>.
                Your session is now active.
              </p>

              {/* Summary pills */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
                {[
                  { icon: '📶', label: '5GHz Band' },
                  { icon: '⚡', label: '5 GB / day' },
                  { icon: '🔒', label: 'Encrypted' },
                ].map(({ icon, label }) => (
                  <div key={label} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: COLORS.bgSection,
                    border: `1px solid ${COLORS.gold.border}`,
                    borderRadius: '20px',
                    fontSize: '13px',
                    color: COLORS.textBody,
                    fontFamily: FONTS.primary,
                  }}>
                    {icon} {label}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${COLORS.gold.border}`,
                    borderRadius: '8px',
                    color: COLORS.textMuted,
                    fontFamily: FONTS.primary,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Register Another
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: COLORS.gold.primary,
                    border: 'none',
                    borderRadius: '8px',
                    color: COLORS.maroon.dark,
                    fontFamily: FONTS.primary,
                    fontWeight: 'bold',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Go to Dashboard →
                </button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}