/**
 * ContactPage Component
 * 
 * Contact Us page with two-column layout: Left side has contact info cards
 * and campus map placeholder. Right side has message form with success confirmation.
 */

import { useState } from 'react';
import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function ContactPage({ onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setIsSubmitted(false);
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: '12px 16px',
    backgroundColor: COLORS.bgInput,
    border: `2px solid ${focusedField === fieldName ? COLORS.gold.primary : COLORS.gold.border}`,
    borderRadius: '8px',
    color: COLORS.maroon.card,
    fontFamily: FONTS.primary,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: focusedField === fieldName ? `0 0 8px ${COLORS.gold.primary}` : 'none',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="contact" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section
        style={{
          background: COLORS.backgrounds.gradient,
          padding: '60px 40px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
          Contact Us
        </h1>
        <p style={{ fontSize: '20px', color: COLORS.text.white, fontFamily: FONTS.primary, maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Get in touch with the WildConnect team for support or inquiries
        </p>
      </section>

      {/* Main Content */}
      <section style={{ flex: 1, padding: '60px 40px', backgroundColor: COLORS.bgPage }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Left Column - Contact Info */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
              Get In Touch
            </h2>

            {/* Contact Info Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              {[
                { icon: '📍', label: 'Address', value: 'N. Bacalso Ave, Cebu City' },
                { icon: '📞', label: 'Phone', value: '(032) 261-7741' },
                { icon: '📧', label: 'Email', value: 'wildconnect@cit.edu' },
                { icon: '🕒', label: 'Hours', value: 'Mon–Fri 8AM–5PM' },
              ].map((item, idx) => (
                <Card key={idx} style={{ padding: '20px', backgroundColor: COLORS.bgSection }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '32px' }}>{item.icon}</div>
                    <div>
                      <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '0 0 4px 0', fontWeight: 'bold' }}>
                        {item.label}
                      </p>
                      <p style={{ fontSize: '16px', color: COLORS.textBody, fontFamily: FONTS.primary, margin: 0 }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Campus Map Placeholder */}
            <Card style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgSection }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                <p style={{ fontSize: '16px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: 0 }}>
                  Campus Map
                </p>
                <p style={{ fontSize: '12px', color: COLORS.textMuted, fontFamily: FONTS.primary, margin: '4px 0 0 0' }}>
                  N. Bacalso Ave, Cebu City
                </p>
              </div>
            </Card>
          </div>

          {/* Right Column - Message Form */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '32px' }}>
              Send Us a Message
            </h2>

            {isSubmitted ? (
              <Card style={{ textAlign: 'center', padding: '60px 40px' }}>
                <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: COLORS.textHeading, fontFamily: FONTS.primary, marginBottom: '16px' }}>
                  Message Sent Successfully!
                </h3>
                <p style={{ fontSize: '16px', color: COLORS.textBody, fontFamily: FONTS.primary, marginBottom: '32px', lineHeight: '1.6' }}>
                  Thank you for contacting us. We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={handleReset}
                  onMouseEnter={() => setHoveredButton('send-another')}
                  onMouseLeave={() => setHoveredButton(null)}
                  style={{
                    backgroundColor: hoveredButton === 'send-another' ? COLORS.gold.light : COLORS.gold.primary,
                    color: COLORS.maroon.dark,
                    border: 'none',
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    fontFamily: FONTS.primary,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: hoveredButton === 'send-another' ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  Send Another Message
                </button>
              </Card>
            ) : (
              <Card>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Name & Email */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={inputStyle('name')}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={inputStyle('email')}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={inputStyle('subject')}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ display: 'block', color: COLORS.textHeading, fontFamily: FONTS.primary, fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows="6"
                      style={{
                        ...inputStyle('message'),
                        resize: 'vertical',
                        minHeight: '120px',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onMouseEnter={() => setHoveredButton('submit')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      backgroundColor: hoveredButton === 'submit' ? COLORS.gold.light : COLORS.gold.primary,
                      color: COLORS.maroon.dark,
                      border: 'none',
                      padding: '14px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      fontFamily: FONTS.primary,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: hoveredButton === 'submit' ? 'translateY(-2px)' : 'translateY(0)',
                    }}
                  >
                    Send Message →
                  </button>
                </form>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
