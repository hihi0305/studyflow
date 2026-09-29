const API_BASE_URL = '/api';

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Registration failed');
    }

    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Invalid email or password.');
    }
    return data;
  },
};


/* mock test
export const authService = {
    async login(email, password) {
      const users = JSON.parse(localStorage.getItem("studyflow_users") || "[]");
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  
      if (!user) {
        // Create user entry if logging in for the first time
        user = { id: `user_${email.toLowerCase()}`, name: email.split("@"), email };
        users.push(user);
        localStorage.setItem("studyflow_users", JSON.stringify(users));
      }
  
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    },
  
    async register(name, email, password) {
      const users = JSON.parse(localStorage.getItem("studyflow_users") || "[]");
  
      // Prevent duplicate email registrations in mock mode
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error("An account with this email address already exists.");
      }
  
      const userId = `user_${email.toLowerCase()}`;
      const newUser = { id: userId, name, email };
  
      users.push(newUser);
      localStorage.setItem("studyflow_users", JSON.stringify(users));
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    },
  
    logout() {
      localStorage.removeItem("user");
    },
  
    getCurrentUser() {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    },
  };
  */