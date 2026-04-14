/**
 * RegisterPage Component
 * 
 * User registration page with centered card layout. Includes fields for
 * First Name, Last Name, School ID, Email, Role, Password, and Confirm Password.
 * Full validation, loading state, and terms checkbox.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function RegisterPage({ onNavigate, onRegister }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    schoolId: '',
    email: '',
    role: 'Student',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.schoolId.trim()) newErrors.schoolId = 'School ID is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onRegister({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
      });
      onNavigate('landing');
    }, 1200);
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(61,8,8,0.6)',
    border: `2px solid ${errors[fieldName] ? '#ff4444' : focusedField === fieldName ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px',
    color: COLORS.text.white,
    fontFamily: fieldName === 'schoolId' ? FONTS.mono : FONTS.primary,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === fieldName ? `0 0 8px ${COLORS.gold.primary}` : 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="register" onNavigate={onNavigate} />

      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        <Card style={{ width: '100%', maxWidth: '700px', padding: '0' }}>
          {/* Header Bar */}
          <div
            style={{
              backgroundColor: COLORS.maroon.medium,
              padding: '24px 32px',
              borderBottom: `2px solid ${COLORS.gold.border}`,
              borderRadius: '12px 12px 0 0',
            }}
          >
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, margin: 0 }}>
              Create Your Account
            </h2>
            <p style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, margin: '8px 0 0 0' }}>
              Join WildConnect and manage your campus network access
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* First Name & Last Name */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('firstName')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('firstName')}
                  />
                  {errors.firstName && (
                    <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('lastName')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('lastName')}
                  />
                  {errors.lastName && (
                    <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* School ID & Email */}
              <div>
                <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  School ID
                </label>
                <input
                  type="text"
                  name="schoolId"
                  value={formData.schoolId}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('schoolId')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('schoolId')}
                />
                {errors.schoolId && (
                  <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                    {errors.schoolId}
                  </p>
                )}
              </div>

              <div>
                <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  style={inputStyle('email')}
                />
                {errors.email && (
                  <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Role */}
              <div>
                <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={inputStyle('role')}
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              {/* Password & Confirm Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('password')}
                  />
                  {errors.password && (
                    <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', color: COLORS.text.gold, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '14px' }}>
                  I agree to the{' '}
                  <span style={{ color: COLORS.text.gold, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
                </span>
              </div>
              {errors.agreeTerms && (
                <p style={{ color: '#ff4444', fontFamily: FONTS.primary, fontSize: '12px', marginTop: '-10px', marginBottom: 0 }}>
                  {errors.agreeTerms}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onMouseEnter={() => setHoveredButton('register')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  backgroundColor: isLoading ? COLORS.gold.muted : hoveredButton === 'register' ? COLORS.gold.light : COLORS.gold.primary,
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
                  marginTop: '8px',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', padding: '0 32px 32px 32px' }}>
            <p style={{ color: COLORS.text.white, fontFamily: FONTS.primary, fontSize: '14px', margin: 0 }}>
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
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
                Log in here
              </button>
            </p>
          </div>
        </Card>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
