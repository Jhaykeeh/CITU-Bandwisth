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

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Navigation handler
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Login handler
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name || userData.schoolId);
  };

  // Register handler
  const handleRegister = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.name);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
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
        if (!isLoggedIn) {
          navigate('login');
          return null;
        }
        return (
          <DashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
          />
        );
      
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return <div style={{ minHeight: '100vh' }}>{renderPage()}</div>;
}
