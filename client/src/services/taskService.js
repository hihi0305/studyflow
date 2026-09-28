/*const API_BASE_URL = '/api/tasks';

// Helper to set headers, automatically falling back to localStorage if token isn't passed explicitly
const getHeaders = (token) => {
  const authToken = token || localStorage.getItem('token') || localStorage.getItem('studyflow_token');
  return {
    'Content-Type': 'application/json',
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

export const taskService = {
  // GET /api/tasks - Fetch all tasks for the logged-in user
  async getTasks(token) {
    const res = await fetch(API_BASE_URL, { headers: getHeaders(token) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to fetch tasks');
    return data.tasks || data;
  },

  // POST /api/tasks - Create a new task
  async createTask(taskData, token) {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(taskData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to create task');
    return data;
  },

  // PUT /api/tasks/:id - Update an existing task
  async updateTask(id, taskData, token) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(taskData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || data.message || 'Failed to update task');
    return data;
  },

  // DELETE /api/tasks/:id - Delete a task by ID
  async deleteTask(id, token) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error?.message || data.message || 'Failed to delete task');
    }
    return true;
  },
};*/

let mockTasks = [
  {
    id: "t1",
    title: "Milestone 1 Architecture Proposal",
    description: "Write structural design and API contracts for StudyFlow.",
    course_id: "c1",
    course: { course_code: "CS 415", course_name: "Software Design & Development" },
    due_date: "2026-10-15",
    task_type: "Project",
    priority: "High",
    estimated_hours: 4,
    progress: 60,
    status: "In Progress",
  },
  {
    id: "t2",
    title: "Algorithms Problem Set 3",
    description: "Complete graph traversal exercises.",
    course_id: "c2",
    course: { course_code: "CS 301", course_name: "Data Structures & Algorithms" },
    due_date: "2026-10-02",
    task_type: "Assignment",
    priority: "Medium",
    estimated_hours: 2,
    progress: 0,
    status: "Not Started",
  },
];

export const taskService = {
  async getTasks() {
    return [...mockTasks];
  },

  async createTask(taskData) {
    const newTask = {
      id: `t_${Date.now()}`,
      ...taskData,
    };
    mockTasks.push(newTask);
    return newTask;
  },

  async updateTask(id, taskData) {
    mockTasks = mockTasks.map((t) =>
      t.id === id || t.task_id === id ? { ...t, ...taskData } : t
    );
    return { success: true };
  },

  async deleteTask(id) {
    mockTasks = mockTasks.filter((t) => t.id !== id && t.task_id !== id);
    return { success: true };
  },
};
