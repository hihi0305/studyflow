const API_BASE_URL = '/api/courses';

// Helper to set headers, automatically falling back to localStorage if token isn't passed explicitly
const getHeaders = (token) => {
  const authToken = token || localStorage.getItem('token') || localStorage.getItem('studyflow_token');
  return {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

export const courseService = {
  // GET /api/courses - Fetch all courses
  async getCourses(token) {
    const res = await fetch(API_BASE_URL, { headers: getHeaders(token) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to fetch courses');
    return data.courses || data;
  },

  // POST /api/courses - Create a course
  async createCourse(courseData, token) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(courseData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to create course');
    return data;
  },

  // PUT /api/courses/:id - Update a course by ID
  async updateCourse(id, courseData, token) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(courseData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to update course');
    return data;
  },

  // DELETE /api/courses/:id - Delete a course by ID
  async deleteCourse(id, token) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || data.message || 'Failed to delete course');
    }
    return true;
  },
};

/*
//mock data to test frontend
import { authService } from "./authService";

const getStoredCourses = () => {
  const saved = localStorage.getItem("studyflow_courses");
  return saved ? JSON.parse(saved) : [];
};

const saveCourses = (courses) => {
  localStorage.setItem("studyflow_courses", JSON.stringify(courses));
};

export const courseService = {
  async getCourses() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];

    const allCourses = getStoredCourses();
    return allCourses.filter((course) => course.userId === currentUser.id);
  },

  async createCourse(courseData) {
    const currentUser = authService.getCurrentUser();
    const allCourses = getStoredCourses();

    const newCourse = {
      ...courseData,
      id: Date.now(),
      userId: currentUser?.id,
    };

    allCourses.push(newCourse);
    saveCourses(allCourses);
    return newCourse;
  },

  async updateCourse(id, updates) {
    const allCourses = getStoredCourses();
    const index = allCourses.findIndex((c) => c.id === id);
    if (index !== -1) {
      allCourses[index] = { ...allCourses[index], ...updates };
      saveCourses(allCourses);
      return allCourses[index];
    }
    throw new Error("Course not found");
  },

  async deleteCourse(id) {
    const allCourses = getStoredCourses();
    const filtered = allCourses.filter((c) => c.id !== id);
    saveCourses(filtered);
    return true;
  },
};
*/