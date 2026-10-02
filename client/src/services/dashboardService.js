import { authService } from "./authService";

const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const dashboardService = {
  async getDashboardSummary() {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch dashboard summary');
    }
    return data;
  },
};