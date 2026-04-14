/**
 * AboutPage Component
 * 
 * About Us page with hero section, mission & vision cards, problem statistics,
 * timeline, team section, and tech stack grid. Uses Navbar and Footer.
 */

import { COLORS, FONTS } from '../constants/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar currentPage="about" onNavigate={onNavigate} />

      {/* Hero Section */}
      <section
        style={{
          background: COLORS.backgrounds.gradient,
          padding: '80px 40px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
          About WildConnect
        </h1>
        <p style={{ fontSize: '20px', color: COLORS.text.white, fontFamily: FONTS.primary, maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
          Revolutionizing campus network management at Cebu Institute of Technology – University
        </p>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <Card>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
              🎯 Our Mission
            </h2>
            <p style={{ fontSize: '16px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.8' }}>
              To provide intelligent bandwidth management solutions that ensure fair, efficient, and reliable network access
              for every member of the CITU community, empowering education through seamless connectivity.
            </p>
          </Card>
          <Card>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '16px' }}>
              👁️ Our Vision
            </h2>
            <p style={{ fontSize: '16px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.8' }}>
              To become the leading campus network management system in the Philippines, setting the standard for
              equitable bandwidth distribution and real-time network monitoring in educational institutions.
            </p>
          </Card>
        </div>
      </section>

      {/* The Problem Section */}
      <section style={{ padding: '80px 40px', backgroundColor: COLORS.maroon.dark }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '60px' }}>
          The Problem We Solve
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { stat: '60%', desc: 'Average speed reduction during peak hours' },
            { stat: '4,000+', desc: 'Students affected by network congestion daily' },
            { stat: '₱2M+', desc: 'Annual cost of network inefficiencies' },
          ].map((item, idx) => (
            <Card key={idx} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '12px' }}>
                {item.stat}
              </div>
              <p style={{ fontSize: '16px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6' }}>
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '80px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '60px' }}>
          Our Journey
        </h2>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Vertical Line */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '4px',
              backgroundColor: COLORS.gold.border,
              transform: 'translateX(-50%)',
            }}
          />
          {[
            { year: '2024', title: 'Problem Identified', desc: 'Network congestion and bandwidth abuse became critical at CITU' },
            { year: '2025', title: 'WildConnect Proposed', desc: 'Development of intelligent bandwidth management system approved' },
            { year: '2025', title: 'System Launched', desc: 'WildConnect deployed successfully, serving 12,000+ users' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                marginBottom: '40px',
                position: 'relative',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  flex: idx % 2 === 0 ? 1 : 'none',
                  textAlign: idx % 2 === 0 ? 'right' : 'left',
                  paddingRight: idx % 2 === 0 ? '60px' : 0,
                  paddingLeft: idx % 2 === 0 ? 0 : '60px',
                  marginLeft: idx % 2 === 0 ? 0 : '50%',
                }}
              >
                <Card>
                  <div style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.mono, marginBottom: '8px' }}>
                    {item.year}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6', margin: 0 }}>
                    {item.desc}
                  </p>
                </Card>
              </div>
              {/* Dot */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.gold.primary,
                  border: `4px solid ${COLORS.maroon.dark}`,
                  zIndex: 1,
                }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section style={{ padding: '80px 40px', backgroundColor: COLORS.maroon.dark }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '60px' }}>
          Meet the Team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👨‍💻</div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
              Judd Kristoffer Mayuela
            </h3>
            <p style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '12px' }}>
              Lead Developer
            </p>
            <p style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6' }}>
              Responsible for system architecture, backend integration, and core functionality development.
            </p>
          </Card>
          <Card style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '8px' }}>
              Bryne Kendrick P. Nuñez
            </h3>
            <p style={{ fontSize: '14px', color: COLORS.text.mutedGold, fontFamily: FONTS.primary, marginBottom: '12px' }}>
              UI/UX Developer
            </p>
            <p style={{ fontSize: '14px', color: COLORS.text.white, fontFamily: FONTS.primary, lineHeight: '1.6' }}>
              Designed user interfaces, user experience flows, and visual identity of WildConnect.
            </p>
          </Card>
        </div>
      </section>

      {/* Tech Stack */}
      <section style={{ padding: '80px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary, marginBottom: '60px' }}>
          Technology Stack
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
          {['ReactJS', 'Vite', 'JavaScript', 'CSS-in-JS', 'REST API', 'MySQL'].map((tech, idx) => (
            <Card key={idx} style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.text.gold, fontFamily: FONTS.primary }}>
                {tech}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
