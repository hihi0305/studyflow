const API_BASE_URL = '/api/tasks';

const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}`}),
});

export const TaskService = {
    async getTasks(token) {
        const res = await fetch(API_BASE_URL, { headers: getHeaders(token) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to fetch tasks');
        return data.tasks || data;
    },

    async createTask(taskData, token) {
        const res = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: getHeaders(token),
            body: JSON.stringify(taskData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to create task');
        return data;
    },

    async updateTask(id, taskData, token) {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(token),
            body: JSON.stringify(taskData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || 'Failed to update task');
        return data;
    },

    async deleteTask(id, token) {
        const res = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders(token),
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error?.message || 'Failed to delete task');
        }
        return true;
    },
}