import api, { createFormData } from './api';
import { PersonType } from '@/types';

export const peopleService = {
  // Get all people
  getAllPeople: async (): Promise<PersonType[]> => {
    try {
      const response = await api.get('/people');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get person by ID
  getPersonById: async (id: number): Promise<PersonType> => {
    try {
      const response = await api.get(`/people/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search people by parameters
  searchPeople: async (searchParams: any): Promise<PersonType[]> => {
    try {
      const response = await api.get('/people/search', { params: searchParams });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new person
  createPerson: async (personData: any): Promise<PersonType> => {
    try {
      const formData = createFormData(personData, personData.foto);
      
      const response = await api.post('/people', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update person
  updatePerson: async (id: number, personData: any): Promise<PersonType> => {
    try {
      const formData = createFormData(personData, personData.foto);
      
      const response = await api.put(`/people/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete person
  deletePerson: async (id: number): Promise<void> => {
    try {
      await api.delete(`/people/${id}`);
    } catch (error) {
      throw error;
    }
  },
};