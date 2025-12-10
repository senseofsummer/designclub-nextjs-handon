import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Lesson {
  title: string;
  content: string;
  duration: number;
  order: number;
}

export interface Course {
  id?: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructorId: string;
  instructorName: string;
  price?: number;
  lessons?: Lesson[];
  totalLessons?: number;
  status?: string;
  tags?: string[];
  enrollments?: any[];
}

export const getCourses = async (filters?: { status?: string; category?: string; level?: string; limit?: number }) => {
  try {
    const response = await apiClient.get('/api/courses', { params: filters });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch courses');
  }
};

export const getCourseById = async (courseId: string) => {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch course');
  }
};

export const enrollInCourse = async (courseId: string, enrollmentData: { userId: string; userEmail: string; userName: string }) => {
  try {
    const response = await apiClient.post(`/api/courses/${courseId}/enroll`, enrollmentData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to enroll in course');
  }
};

export const getCourseProgress = async (courseId: string, userId: string) => {
  try {
    const response = await apiClient.get(`/api/courses/${courseId}/progress/${userId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch course progress');
  }
};

