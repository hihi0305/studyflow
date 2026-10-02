import { authService } from './authService';

const API_BASE_URL = '/api';

// Helper to set headers using standardized auth token
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
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch courses');
    }
    return data;
  },

  // POST /api/courses - Create a new course
  async createCourse(courseData) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(courseData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to create course');
    }
    return data;
  },

  // PUT /api/courses/:id - Update an existing course
  async updateCourse(courseId, updates) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update course');
    }
    return data;
  },

  // DELETE /api/courses/:id - Delete a course by ID
  async deleteCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete course');
    }
    return data;
  },
};