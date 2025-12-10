import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Workshop {
  id?: string;
  title: string;
  description: string;
  category: string;
  date: string;
  duration: number;
  maxParticipants?: number;
  instructorId: string;
  instructorName: string;
  location: string;
  price?: number;
  status?: string;
  tags?: string[];
  registrations?: any[];
}

export const getWorkshops = async (filters?: { status?: string; category?: string; limit?: number }) => {
  try {
    const response = await apiClient.get('/api/workshops', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshops');
  }
};

export const getWorkshopById = async (workshopId: string) => {
  try {
    const response = await apiClient.get(`/api/workshops/${workshopId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch workshop');
  }
};

export const createWorkshop = async (workshopData: Workshop) => {
  try {
    const response = await apiClient.post('/api/workshops', workshopData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create workshop');
  }
};

export const registerForWorkshop = async (workshopId: string, registrationData: { userId: string; userEmail: string; userName: string }) => {
  try {
    const response = await apiClient.post(`/api/workshops/${workshopId}/register`, registrationData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to register for workshop');
  }
};

