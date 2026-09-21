const API_BASE_URL = '/api';

export const authService = {
    async register(userData) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Registration failed');
        }

        return data;
    },

    async login(credentials) {
        const reponse = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(credentials),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Invalid email or password.');
        }
        return data;
    },

};