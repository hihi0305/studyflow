/*const API_BASE_URL = '/api/courses';

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
};*/

let mockCourses = [
  {
    id: "c1",
    course_code: "CS 415",
    course_name: "Software Design & Development",
    semester: "Fall 2026",
  },
  {
    id: "c2",
    course_code: "CS 301",
    course_name: "Data Structures & Algorithms",
    semester: "Fall 2026",
  },
];

export const courseService = {
  async getCourses() {
    // Return a copy of the mock courses list
    return [...mockCourses];
  },

  async createCourse(courseData) {
    const newCourse = {
      id: `c_${Date.now()}`,
      ...courseData,
    };
    mockCourses.push(newCourse);
    return newCourse;
  },

  async updateCourse(id, courseData) {
    mockCourses = mockCourses.map((c) =>
      c.id === id || c.course_id === id ? { ...c, ...courseData } : c
    );
    return { success: true };
  },

  async deleteCourse(id) {
    mockCourses = mockCourses.filter((c) => c.id !== id && c.course_id !== id);
    return { success: true };
  },
};
