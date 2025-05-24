import api, { setAuthToken, clearAuthToken, getAuthToken } from './api';

export const authService = {
  // Set token for authenticated requests
  setToken: (token: string) => {
    setAuthToken(token);
  },

  // Clear token on logout
  clearToken: () => {
    clearAuthToken();
  },

  // Get current token
  getToken: () => {
    return getAuthToken();
  },

  // Login user
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    username: string;
    password: string;
  }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify token validity
  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (userData: any) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};