import { useState } from 'react'

export default function Login() {
  const [schoolId, setSchoolId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    alert(`Logging in with School ID: ${schoolId}`)
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid #d4a843',
    borderRadius: '4px',
    fontSize: '14px',
    background: '#fff',
    color: '#3a3a3a',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FFFFFF',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        background: '#5a1010',
        padding: '0 28px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        borderBottom: '3px solid #d4a843',
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
      }}>

        {/* Title */}
        <div>
          <div style={{
            color: '#d4a843',
            fontSize: '15px',
            fontWeight: '800',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            lineHeight: 1.15,
          }}>
            Cebu Institute of Technology
          </div>
          <div style={{
            color: '#e8c878',
            fontSize: '10px',
            fontWeight: '500',
            letterSpacing: '5px',
            textTransform: 'uppercase',
            opacity: 0.85,
          }}>
            University
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        {/* Login Card */}
        <div style={{
          background: '#fff',
          borderRadius: '6px',
          width: '100%',
          maxWidth: '340px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          border: '1px solid #d4a843',
        }}>
          {/* Card Header */}
          <div style={{
            background: '#5a1010',
            padding: '16px 24px',
            borderBottom: '3px solid #d4a843',
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '700',
              color: '#d4a843',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}>
              User Authentication
            </h2>
          </div>

          {/* Card Body */}
          <form onSubmit={handleLogin} style={{ padding: '24px' }}>
            {/* School ID */}
            <div style={{ marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Enter School ID"
                value={schoolId}
                onChange={e => setSchoolId(e.target.value)}
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = '#7a1818'
                  e.target.style.boxShadow = '0 0 0 3px rgba(122,24,24,0.12)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#d4a843'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '10px', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: '42px' }}
                onFocus={e => {
                  e.target.style.borderColor = '#7a1818'
                  e.target.style.boxShadow = '0 0 0 3px rgba(122,24,24,0.12)'
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#d4a843'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#999', fontSize: '14px', padding: '2px 4px',
                  lineHeight: 1,
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <a href="#" style={{
                fontSize: '12px',
                color: '#7a1818',
                textDecoration: 'none',
                fontStyle: 'italic',
              }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #7a1818, #9b2020)',
                color: '#d4a843',
                border: '1.5px solid #d4a843',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
              }}
              onMouseEnter={e => {
                e.target.style.background = 'linear-gradient(135deg, #d4a843, #e8c878)'
                e.target.style.color = '#5a1010'
                e.target.style.borderColor = '#7a1818'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'linear-gradient(135deg, #7a1818, #9b2020)'
                e.target.style.color = '#d4a843'
                e.target.style.borderColor = '#d4a843'
              }}
            >
              Log in
            </button>

            {/* Sign Up */}
            <p style={{
              textAlign: 'center',
              marginTop: '18px',
              marginBottom: 0,
              fontSize: '13px',
              color: '#777',
              fontFamily: 'monospace',
            }}>
              Don't have an account?{' '}
              <a href="#" style={{
                color: '#7a1818',
                fontWeight: '700',
                textDecoration: 'none',
              }}
              onMouseEnter={e => e.target.style.textDecoration = 'underline'}
              onMouseLeave={e => e.target.style.textDecoration = 'none'}
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}