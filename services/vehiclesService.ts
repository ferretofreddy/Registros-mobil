import api, { createFormData } from './api';
import { VehicleType } from '@/types';

export const vehiclesService = {
  // Get all vehicles
  getAllVehicles: async (): Promise<VehicleType[]> => {
    try {
      const response = await api.get('/vehicles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id: number): Promise<VehicleType> => {
    try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search vehicles by parameters
  searchVehicles: async (searchParams: any): Promise<VehicleType[]> => {
    try {
      const response = await api.get('/vehicles/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData: any): Promise<VehicleType> => {
    try {
      const formData = createFormData(vehicleData, vehicleData.foto);
      
      const response = await api.post('/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  updateVehicle: async (id: number, vehicleData: any): Promise<VehicleType> => {
    try {
      const formData = createFormData(vehicleData, vehicleData.foto);
      
      const response = await api.put(`/vehicles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  deleteVehicle: async (id: number): Promise<void> => {
    try {
      await api.delete(`/vehicles/${id}`);
    } catch (error) {
      throw error;
    }
  },
};