import { createContext, useContext, useState, useEffect, useContext } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);
const TOKEN_KEY = 'studyflow_access_token';
const USER_KEY = 'studyflow_user';

export function AuthProvider({ children }) {
    const [token, setToken] = useState (() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
          const activeToken = authService.getToken();
          if (activeToken) {
            setToken(activeToken);
            try {
              const currentUser = await authService.getCurrentUser();
              setUser(currentUser);
            } catch {
              authService.removeToken();
              setToken(null);
              setUser(null);
            }
          }
          setLoading(false);
        };
        initAuth();
      }, []);
    
      const login = async (credentials) => {
        const data = await authService.login(credentials);
        setToken(data.accessToken);
        setUser(data.user);
        return data;
      };
    
      const register = async (userData) => {
        const data = await authService.register(userData);
        return data; // Returns { user }
      };
    
      const logout = () => {
        authService.logout();
        setToken(null);
        setUser(null);
      };
    
      return (
        <AuthContext.Provider
          value={{
            user,
            token,
            loading,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
          }}
        >
          {!loading && children}
        </AuthContext.Provider>
      );
    }
    
    export const useAuth = () => {
      const context = useContext(AuthContext);
      if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
      }
      return context;
    };