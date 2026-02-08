import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

// Create Theme Context
const ThemeContext = createContext(null);

// Theme options
export const THEME_OPTIONS = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }) {
  // Get initial theme preference from localStorage or default to 'system'
  const [themePreference, setThemePreference] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    return stored && Object.values(THEME_OPTIONS).includes(stored) 
      ? stored 
      : THEME_OPTIONS.SYSTEM;
  });

  // Track the actual theme (resolved from system preference if needed)
  const [resolvedTheme, setResolvedTheme] = useState('light');

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      let newTheme;
      if (themePreference === THEME_OPTIONS.SYSTEM) {
        newTheme = mediaQuery.matches ? 'dark' : 'light';
      } else {
        newTheme = themePreference;
      }
      setResolvedTheme(newTheme);
    };

    // Initial update
    updateResolvedTheme();

    // Listen for system theme changes
    const handleChange = () => {
      if (themePreference === THEME_OPTIONS.SYSTEM) {
        updateResolvedTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, themePreference);
  }, [themePreference]);

  // Set theme preference
  const setTheme = useCallback((theme) => {
    if (Object.values(THEME_OPTIONS).includes(theme)) {
      setThemePreference(theme);
    }
  }, []);

  // Toggle between light and dark (skipping system)
  const toggleTheme = useCallback(() => {
    setThemePreference(prev => {
      if (prev === THEME_OPTIONS.LIGHT) return THEME_OPTIONS.DARK;
      if (prev === THEME_OPTIONS.DARK) return THEME_OPTIONS.SYSTEM;
      return THEME_OPTIONS.LIGHT;
    });
  }, []);

  const value = {
    themePreference,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    setTheme,
    toggleTheme,
    THEME_OPTIONS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to use Theme Context
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
