/**
 * Theme Constants for WildConnect
 * 
 * Centralized color palette, typography, navigation links,
 * menu features, and registration steps configuration.
 * All components must import from this file - no hardcoded hex values.
 */

export const COLORS = {
  maroon: {
    dark: '#3d0808',
    medium: '#5a0c0c',
    light: '#7a1010',
    card: '#2a0808',
  },
  gold: {
    primary: '#d4a843',
    light: '#e8c878',
    border: 'rgba(212,168,67,0.2)',
    muted: 'rgba(212,168,67,0.7)',
  },
  text: {
    white: '#ffffff',
    gold: '#d4a843',
    mutedGold: 'rgba(212,168,67,0.7)',
  },
  backgrounds: {
    gradient: 'linear-gradient(135deg, #3d0808 0%, #7a1010 100%)',
    card: '#2a0808',
  },
  
  // New white-body tokens
  bgPage: '#ffffff',              // main page background
  bgSection: '#fdf8f2',           // alternating section background
  bgCard: '#ffffff',              // card/panel background
  bgInput: '#ffffff',             // form input background
  textBody: '#3a3a3a',            // general body text on white
  textHeading: '#7a1010',         // headings on white backgrounds
  textMuted: '#777777',           // secondary/muted text on white
  textPlaceholder: '#aaaaaa',     // input placeholder on white
  borderCard: 'rgba(212,168,67,0.3)',  // card border
};

export const FONTS = {
  primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  mono: "'Courier New', Courier, monospace",
};

export const NAV_LINKS = [
  { key: 'landing', label: 'Home' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact' },
  { key: 'login', label: 'Login' },
];

export const MENU_FEATURES = [
  {
    icon: '📶',
    title: 'WiFi Registration',
    desc: 'Register new devices to the campus network',
    key: 'wifi-registration',
  },
  {
    icon: '📊',
    title: 'Bandwidth Monitor',
    desc: 'Real-time bandwidth usage tracking',
    key: 'bandwidth-monitor',
  },
  {
    icon: '👤',
    title: 'My Account',
    desc: 'Manage your profile and settings',
    key: 'my-account',
  },
  {
    icon: '📈',
    title: 'Usage Reports',
    desc: 'View detailed bandwidth consumption reports',
    key: 'usage-reports',
  },
  {
    icon: '🔒',
    title: 'Access Control',
    desc: 'Manage network access permissions',
    key: 'access-control',
  },
  {
    icon: '⚙️',
    title: 'Admin Panel',
    desc: 'System administration and configuration',
    key: 'admin-panel',
  },
];

export const REGISTRATION_STEPS = [
  { label: 'Scan ID', icon: '📷' },
  { label: 'Verify', icon: '✓' },
  { label: 'Connect', icon: '📶' },
];
