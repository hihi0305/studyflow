import { data } from 'react-router-dom';
import { authService } from './authService';
const API_BASE_URL = '/api/courses';

// Helper to set headers, automatically falling back to localStorage if token isn't passed explicitly
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const courseService = {
  // GET /api/courses - Fetch all courses
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to fetch courses');
    return data;
  },

  // POST /api/courses - Create a course
  async createCourse(courseData) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });

    const data = await response.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to create course');
    return data;
  },

  // PUT /api/courses/:id - Update a course by ID
  async updateCourse(courseId, updates) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || 'Failed to update course');
    return data;
  },

  // DELETE /api/courses/:id - Delete a course by ID
  async deleteCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || 'Failed to delete course');
    }
    return data;
  },
};