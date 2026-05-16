import api from './api';

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export const deviceService = {
  // Register device
  registerDevice: async (deviceData) => {
    const response = await api.post('/devices', deviceData);
    return response.data;
  },

  // Get user devices
  getDevices: async () => {
    const response = await api.get('/devices');
    return response.data;
  },

  // Get all devices (admin only)
  getAllDevices: async () => {
    const response = await api.get('/devices/admin/all');
    return response.data;
  },

  // Update device
  updateDevice: async (deviceId, deviceData) => {
    const response = await api.put(`/devices/${deviceId}`, deviceData);
    return response.data;
  },

  // Delete device
  deleteDevice: async (deviceId) => {
    const response = await api.delete(`/devices/${deviceId}`);
    return response.data;
  },

  // Approve device (admin only)
  approveDevice: async (deviceId) => {
    const response = await api.put(`/devices/admin/${deviceId}/approve`);
    return response.data;
  },

  // Reject device (admin only)
  rejectDevice: async (deviceId) => {
    const response = await api.put(`/devices/admin/${deviceId}/reject`);
    return response.data;
  },
};

export const bandwidthService = {
  // Log bandwidth usage
  logUsage: async (usageData) => {
    const response = await api.post('/bandwidth/log', usageData);
    return response.data;
  },

  // Get user bandwidth usage
  getUserUsage: async () => {
    const response = await api.get('/bandwidth/user');
    return response.data;
  },

  // Get total usage
  getTotalUsage: async () => {
    const response = await api.get('/bandwidth/user/total');
    return response.data;
  },

  // Get usage in date range
  getUsageInRange: async (start, end) => {
    const response = await api.get('/bandwidth/user/range', {
      params: { start, end }
    });
    return response.data;
  },

  // Get all usage records (admin only)
  getAllUsage: async () => {
    const response = await api.get('/bandwidth/admin/all');
    return response.data;
  },
};