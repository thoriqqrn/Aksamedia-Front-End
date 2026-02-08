import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom hook for managing URL query parameters
 * @returns {object} - Query param utilities
 */
export function useQueryParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get a query parameter value
  const getParam = useCallback((key, defaultValue = '') => {
    return searchParams.get(key) || defaultValue;
  }, [searchParams]);

  // Get numeric query parameter
  const getNumericParam = useCallback((key, defaultValue = 1) => {
    const value = searchParams.get(key);
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  }, [searchParams]);

  // Set a single query parameter
  const setParam = useCallback((key, value) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
      return newParams;
    });
  }, [setSearchParams]);

  // Set multiple query parameters at once
  const setParams = useCallback((params) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      Object.entries(params).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      return newParams;
    });
  }, [setSearchParams]);

  // Clear all query parameters
  const clearParams = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    getParam,
    getNumericParam,
    setParam,
    setParams,
    clearParams,
    searchParams,
  };
}

export default useQueryParams;
