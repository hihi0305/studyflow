import { authService } from '.authService';
const API_BASE_URL = '/api/tasks';

// Helper to set headers, automatically falling back to localStorage if token isn't passed explicitly
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const taskService = {
  // GET /api/tasks - Fetch all tasks for the logged-in user
  async getTasks() {
    const response = await fetch(`{API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
  },

  // POST /api/tasks - Create a new task
  async createTask(taskData, token) {
    const response = await fetch(`{API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to create task');
    return data;
  },

  // PUT /api/tasks/:id - Update an existing task
  async updateTask(taskId, updates) {
    const res = await fetch(`${API_BASE_URL}/tasks/${tasksId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Failed to update task');
    return data;
  },

  // DELETE /api/tasks/:id - Delete a task by ID
  async deleteTask(taskId) {
    const res = await fetch(`${API_BASE_URL}/tasks/${tasksId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete task');
    }
    return data;
  },
};

