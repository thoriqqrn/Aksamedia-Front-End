import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CREDENTIALS, DEFAULT_USER, STORAGE_KEYS } from '../utils/constants';

// Create Auth Context
const AuthContext = createContext(null);

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth session on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem(STORAGE_KEYS.AUTH);
        const userData = localStorage.getItem(STORAGE_KEYS.USER);

        if (authData === 'true' && userData) {
          setIsAuthenticated(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear invalid data
        localStorage.removeItem(STORAGE_KEYS.AUTH);
        localStorage.removeItem(STORAGE_KEYS.USER);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = useCallback((username, password) => {
    // Validate credentials against static values
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      const userData = { ...DEFAULT_USER };
      
      // Check if there's existing user data with customized fullName
      const existingUserData = localStorage.getItem(STORAGE_KEYS.USER);
      if (existingUserData) {
        try {
          const parsed = JSON.parse(existingUserData);
          if (parsed.fullName) {
            userData.fullName = parsed.fullName;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Username atau password salah!' };
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    // Don't remove user data to preserve full name changes
  }, []);

  // Update user data
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const newUser = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use Auth Context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
