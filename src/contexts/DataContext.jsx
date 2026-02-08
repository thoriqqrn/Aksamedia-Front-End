import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, INITIAL_DATA } from '../utils/constants';

// Create Data Context
const DataContext = createContext(null);

/**
 * Data Provider Component for CRUD operations
 */
export function DataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DATA);
      return stored ? JSON.parse(stored) : INITIAL_DATA;
    } catch (error) {
      console.error('Error loading data:', error);
      return INITIAL_DATA;
    }
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify(data));
  }, [data]);

  // Generate new ID
  const generateId = useCallback(() => {
    if (data.length === 0) return 1;
    return Math.max(...data.map(item => item.id)) + 1;
  }, [data]);

  // Create new item
  const createItem = useCallback((newItem) => {
    const itemWithId = {
      ...newItem,
      id: generateId(),
    };
    setData(prev => [...prev, itemWithId]);
    return itemWithId;
  }, [generateId]);

  // Read item by ID
  const getItem = useCallback((id) => {
    return data.find(item => item.id === parseInt(id));
  }, [data]);

  // Update existing item
  const updateItem = useCallback((id, updates) => {
    setData(prev => prev.map(item => 
      item.id === parseInt(id) ? { ...item, ...updates } : item
    ));
  }, []);

  // Delete item
  const deleteItem = useCallback((id) => {
    setData(prev => prev.filter(item => item.id !== parseInt(id)));
  }, []);

  // Search/filter data
  const searchData = useCallback((searchTerm) => {
    if (!searchTerm) return data;
    const term = searchTerm.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.role.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }, [data]);

  // Get paginated data
  const getPaginatedData = useCallback((filteredData, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, []);

  // Get total pages
  const getTotalPages = useCallback((filteredData, itemsPerPage) => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, []);

  // Reset data to initial state
  const resetData = useCallback(() => {
    setData(INITIAL_DATA);
  }, []);

  const value = {
    data,
    createItem,
    getItem,
    updateItem,
    deleteItem,
    searchData,
    getPaginatedData,
    getTotalPages,
    resetData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Custom hook to use Data Context
 */
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
