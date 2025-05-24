import api, { createFormData } from './api';
import { PropertyType } from '@/types';

export const propertiesService = {
  // Get all properties
  getAllProperties: async (): Promise<PropertyType[]> => {
    try {
      const response = await api.get('/properties');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get property by ID
  getPropertyById: async (id: number): Promise<PropertyType> => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search properties by parameters
  searchProperties: async (searchParams: any): Promise<PropertyType[]> => {
    try {
      const response = await api.get('/properties/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new property
  createProperty: async (propertyData: any): Promise<PropertyType> => {
    try {
      const formData = createFormData(propertyData, propertyData.foto);
      
      const response = await api.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update property
  updateProperty: async (id: number, propertyData: any): Promise<PropertyType> => {
    try {
      const formData = createFormData(propertyData, propertyData.foto);
      
      const response = await api.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete property
  deleteProperty: async (id: number): Promise<void> => {
    try {
      await api.delete(`/properties/${id}`);
    } catch (error) {
      throw error;
    }
  },
};