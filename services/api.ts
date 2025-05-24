import axios from 'axios';
import { Platform } from 'react-native';

// Create a base axios instance with default config
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://api.registrospoliciales.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Track the auth token
let authToken: string | null = null;

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Error de red. Verifique su conexión a internet.'));
    }

    // Handle specific error status codes
    switch (error.response.status) {
      case 401:
        // Unauthorized - token might be expired
        console.error('Authentication Error:', error.response.data);
        return Promise.reject(new Error('Sesión expirada o inválida. Por favor inicie sesión nuevamente.'));
      case 403:
        // Forbidden - no permission
        console.error('Permission Error:', error.response.data);
        return Promise.reject(new Error('No tiene permisos para realizar esta acción.'));
      case 404:
        // Not found
        console.error('Not Found Error:', error.response.data);
        return Promise.reject(new Error('El recurso solicitado no fue encontrado.'));
      case 500:
        // Server error
        console.error('Server Error:', error.response.data);
        return Promise.reject(new Error('Error del servidor. Por favor intente más tarde.'));
      default:
        console.error('API Error:', error.response.data);
        return Promise.reject(error);
    }
  }
);

// Helper functions for API module
export const setAuthToken = (token: string) => {
  authToken = token;
};

export const clearAuthToken = () => {
  authToken = null;
};

export const getAuthToken = () => {
  return authToken;
};

// Handle form data for multipart/form-data requests (file uploads)
export const createFormData = (data: any, photo?: string | null) => {
  const formData = new FormData();

  // Add all data fields to form data
  Object.keys(data).forEach(key => {
    formData.append(key, data[key]);
  });

  // Add photo if provided
  if (photo) {
    const uriParts = photo.split('.');
    const fileType = uriParts[uriParts.length - 1];

    formData.append('photo', {
      uri: Platform.OS === 'android' ? photo : photo.replace('file://', ''),
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  }

  return formData;
};

export default api;