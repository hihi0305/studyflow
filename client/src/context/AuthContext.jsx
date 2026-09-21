import { createContext, useContex, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const TOKEN_KEY = 'studyflow_access_token';
const USER_KEY = 'studyflow_user';

export function AuthProvider({ children }) {
    const [token, setToken] = useState (() => localStorage.getItem(TOKEN_KEY));
    const[user, setUser] = useState(() => {
        const saved = localStorage.getItem(USER_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setToken(data.accessToken);
            setUser(data.user);
            localStorage.setItem(TOKEN_KEY, data.accessToken);
            localStorage.setItem(USER_KEY, JSONstringify(data.user));
            return data;
        }
        finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await authService.register(userData);
            setToken(data.accessToken);
            setUser(data.user);
            localStorage.setItem(TOKEN_KEY, data.accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(data.user));
            return data;
        }
        finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);