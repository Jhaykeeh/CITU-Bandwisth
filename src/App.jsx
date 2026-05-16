/**
 * App.jsx - Main Application Router
 */

import { useState } from 'react';
import { authService } from './services/authService';
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

function getInitialUser() {
  if (!authService.isAuthenticated()) {
    return { schoolId: '', role: '' };
  }

  const user = authService.getCurrentUser();
  return {
    schoolId: user?.schoolId || '',
    role: user?.role === 'ADMIN' ? 'admin' : 'student',
  };
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (authService.isAuthenticated()) return 'dashboard';
    return 'landing';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [userName, setUserName] = useState(() => getInitialUser().schoolId);
  const [userRole, setUserRole] = useState(() => getInitialUser().role);

  // Navigation
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Login handler
  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.schoolId);
    setUserRole(userData.role === 'ADMIN' ? 'admin' : 'student');
    navigate('dashboard');
  };

  // Register handler
  const handleRegister = (userData) => {
    setIsLoggedIn(true);
    setUserName(userData.schoolId);
    setUserRole('student');
    navigate('dashboard');
  };

  // Logout
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
    navigate('landing');
  };

  // AUTH GUARD (Private Route logic)
  const requireAuth = (component) => {
    return isLoggedIn ? component : (navigate('login'), null);
  };

  // ADMIN GUARD
  const requireAdmin = (component) => {
    return userRole === 'admin' ? component : (navigate('dashboard'), null);
  };

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
        return requireAuth(
          <DashboardPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'my-account':
        return requireAuth(
          <MyAccountPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'bandwidth-monitor':
        return requireAuth(
          <BandwidthMonitorPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'wifi-registration':
        return requireAuth(
          <WifiRegistrationPage
            onNavigate={navigate}
            onLogout={handleLogout}
            userName={userName}
            userRole={userRole}
          />
        );

      case 'admin-panel':
        return requireAuth(
          requireAdmin(
            <AdminDashboardPage
              onNavigate={navigate}
              onLogout={handleLogout}
            />
          )
        );

      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return <div style={{ minHeight: '100vh' }}>{renderPage()}</div>;
}
