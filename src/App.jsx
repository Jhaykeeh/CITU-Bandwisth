/**
 * App.jsx - Main Application Router
 *
 * Central router/controller for WildConnect application.
 * Manages page state with switch statement rendering.
 * Handles login, register, and logout navigation flows.
 */

import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import MyAccountPage from './pages/MyAccountPage';
import BandwidthMonitorPage from './pages/BandwidthMonitorPage';
import WifiRegistrationPage from './pages/WifiRegistrationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState(''); // 'student' | 'admin'

  // Navigation handler
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Login handler
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name || userData.schoolId);
    setUserRole(userData.role || 'student');
  };

  // Register handler
  const handleRegister = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
    setUserRole('student');
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    navigate('landing');
  };

  // Page renderer
  const renderPage = () => {
    switch (currentPage) {

      case 'landing':
        return <LandingPage onNavigate={navigate} />;

      case 'login':
        return <LoginPage onNavigate={navigate} onLogin={handleLogin} />;

      case 'register':
        return <RegisterPage onNavigate={navigate} onRegister={handleRegister} />;

      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={navigate} />;

      case 'about':
        return <AboutPage onNavigate={navigate} />;

      case 'contact':
        return <ContactPage onNavigate={navigate} />;

      case 'dashboard':
        if (!isLoggedIn) { navigate('login'); return null; }
        return (
          <DashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'my-account':
        if (!isLoggedIn) { navigate('login'); return null; }
        return (
          <MyAccountPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'bandwidth-monitor':
        if (!isLoggedIn) { navigate('login'); return null; }
        return (
          <BandwidthMonitorPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'wifi-registration':
        if (!isLoggedIn) { navigate('login'); return null; }
        return (
          <WifiRegistrationPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'admin-panel':
        if (userRole !== 'admin') { navigate('dashboard'); return null; }
        return (
          <AdminDashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        );

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return <div style={{ minHeight: '100vh' }}>{renderPage()}</div>;
}