/**
 * LoginPage Component
 * 
 * User login page with split layout: Left branding panel + Right form panel.
 * Includes School ID and Password fields, show/hide toggle, forgot password link,
 * loading state, and inline validation. Navigates to dashboard on success.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LoginPage({ onNavigate, onLogin }) {
  const [schoolId, setSchoolId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!schoolId.trim()) newErrors.schoolId = 'School ID is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ schoolId, name: schoolId });
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="login" onNavigate={onNavigate} />

      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        {/* Left Branding Panel */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.maroon.dark} 0%, ${COLORS.maroon.medium} 100%)`,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            borderRight: `2px solid ${COLORS.gold.border}`,
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📶</div>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
            Welcome Back to WildConnect
          </h1>
          <p style={{ fontSize: '18px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6', marginBottom: '32px' }}>
            Access your bandwidth management dashboard and monitor your network usage in real-time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {['Real-time bandwidth monitoring', 'Device management', 'Usage reports & analytics'].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: COLORS.text.gold, fontSize: '20px' }}>✓</span>
                <span style={{ color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '16px' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form Panel */}
        <div
          style={{
            backgroundColor: COLORS.bgPage,
            padding: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
            Log In
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* School ID Field */}
            <div>
              <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                School ID
              </label>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                onFocus={() => setFocusedField('schoolId')}
                onBlur={() => setFocusedField(null)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: COLORS.bgInput,
                  border: `2px solid ${errors.schoolId ? '#ff4444' : focusedField === 'schoolId' ? COLORS.gold.primary : COLORS.gold.border}`,
                  borderRadius: '8px',
                  color: COLORS.maroon.card,
                  fontFamily: FONTS.mono,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'schoolId' ? `0 0 8px ${COLORS.gold.primary}` : 'none',
                }}
              />
              {errors.schoolId && (
                <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                  {errors.schoolId}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 16px',
                    backgroundColor: COLORS.bgInput,
                    border: `2px solid ${errors.password ? '#ff4444' : focusedField === 'password' ? COLORS.gold.primary : COLORS.gold.border}`,
                    borderRadius: '8px',
                    color: COLORS.maroon.card,
                    fontFamily: FONTS.mono,
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: focusedField === 'password' ? `0 0 8px ${COLORS.gold.primary}` : 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: COLORS.text.mutedGold,
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '4px',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'right' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: COLORS.text.gold,
                  fontFamily: FONTS.primary,
                  fontSize: '14px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              onMouseEnter={() => setHoveredButton('login')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                backgroundColor: isLoading ? COLORS.gold.muted : hoveredButton === 'login' ? COLORS.gold.light : COLORS.gold.primary,
                color: COLORS.maroon.dark,
                border: 'none',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 'bold',
                fontFamily: FONTS.primary,
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          {/* Register Link */}
          <p style={{ textAlign: 'center', marginTop: '24px', color: COLORS.textBody, fontFamily: FONTS.primary, fontSize: '14px' }}>
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.text.gold,
                fontFamily: FONTS.primary,
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Register here
            </button>
          </p>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
