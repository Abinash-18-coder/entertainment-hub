import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('cineverse_access_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on initial app load or page refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('cineverse_access_token');
      if (storedToken) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (err) {
          console.error('Failed to restore session:', err);
          localStorage.removeItem('cineverse_access_token');
          localStorage.removeItem('cineverse_refresh_token');
          setUser(null);
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Handle User Login
  const login = async (email, password) => {
    const tokenData = await loginUser(email, password);
    localStorage.setItem('cineverse_access_token', tokenData.access_token);
    localStorage.setItem('cineverse_refresh_token', tokenData.refresh_token);
    setAccessToken(tokenData.access_token);

    // Fetch user profile
    const userData = await fetchCurrentUser();
    setUser(userData);
    return userData;
  };

  // Handle User Registration
  const register = async (email, password) => {
    await registerUser(email, password);
    // Automatically log user in after successful registration
    return await login(email, password);
  };

  // Handle User Logout
  const logout = () => {
    localStorage.removeItem('cineverse_access_token');
    localStorage.removeItem('cineverse_refresh_token');
    setUser(null);
    setAccessToken(null);
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext cleanly
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};