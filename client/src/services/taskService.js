const API_BASE_URL = '/api/tasks';

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
};

/*
import { authService } from "./authService";

const getStoredTasks = () => {
  const saved = localStorage.getItem("studyflow_tasks");
  return saved ? JSON.parse(saved) : [];
};

const saveTasks = (tasks) => {
  localStorage.setItem("studyflow_tasks", JSON.stringify(tasks));
};

export const taskService = {
  async getTasks() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return [];

    const allTasks = getStoredTasks();
    return allTasks.filter((task) => task.userId === currentUser.id);
  },

  async createTask(taskData) {
    const currentUser = authService.getCurrentUser();
    const allTasks = getStoredTasks();

    const newTask = {
      ...taskData,
      id: Date.now(),
      userId: currentUser?.id,
    };

    allTasks.push(newTask);
    saveTasks(allTasks);
    return newTask;
  },

  async updateTask(id, updates) {
    const allTasks = getStoredTasks();
    const index = allTasks.findIndex((t) => t.id === id);
    if (index !== -1) {
      allTasks[index] = { ...allTasks[index], ...updates };
      saveTasks(allTasks);
      return allTasks[index];
    }
    throw new Error("Task not found");
  },

  async deleteTask(id) {
    const allTasks = getStoredTasks();
    const filtered = allTasks.filter((t) => t.id !== id);
    saveTasks(filtered);
    return true;
  },
};
*/