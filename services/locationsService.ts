import api, { createFormData } from './api';
import { LocationType } from '@/types';

export const locationsService = {
  // Get all locations
  getAllLocations: async (): Promise<LocationType[]> => {
    try {
      const response = await api.get('/locations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get location by ID
  getLocationById: async (id: number): Promise<LocationType> => {
    try {
      const response = await api.get(`/locations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search locations by parameters
  searchLocations: async (searchParams: any): Promise<LocationType[]> => {
    try {
      const response = await api.get('/locations/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new location
  createLocation: async (locationData: any): Promise<LocationType> => {
    try {
      const formData = createFormData(locationData, locationData.foto);
      
      const response = await api.post('/locations', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update location
  updateLocation: async (id: number, locationData: any): Promise<LocationType> => {
    try {
      const formData = createFormData(locationData, locationData.foto);
      
      const response = await api.put(`/locations/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete location
  deleteLocation: async (id: number): Promise<void> => {
    try {
      await api.delete(`/locations/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Get nearby locations
  getNearbyLocations: async (lat: number, lng: number, radius: number): Promise<LocationType[]> => {
    try {
      const response = await api.get('/locations/nearby', {
        params: { lat, lng, radius },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};