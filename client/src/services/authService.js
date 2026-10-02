const API_BASE_URL = '/api';
const TOKEN_KEY = 'studyflow_access_token';

export const authService = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),

  async register(userData) { // Expects object: { name, email, password }
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }
    return data; // Returns { user }
  },

  async login(credentials) { // Expects object: { email, password }
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Invalid email or password.');
    }

    if (data.accessToken) {
      this.setToken(data.accessToken);
    }
    return data; // Returns { user, accessToken }
  },

  async getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      this.removeToken();
      return null;
    }
    const data = await response.json();
    return data.user;
  },

  logout() {
    this.removeToken();
  },
};