// Static credentials for authentication
export const CREDENTIALS = {
  username: 'admin',
  password: 'password123',
};

// Default user data
export const DEFAULT_USER = {
  id: 1,
  username: 'admin',
  fullName: 'Administrator',
};

// Initial sample data for CRUD
export const INITIAL_DATA = [
  { id: 1, name: 'Ahmad Fauzi', email: 'ahmad@example.com', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Siti Nurhaliza', email: 'siti@example.com', role: 'Designer', status: 'Active' },
  { id: 3, name: 'Budi Santoso', email: 'budi@example.com', role: 'Manager', status: 'Inactive' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', role: 'Developer', status: 'Active' },
  { id: 5, name: 'Agus Pratama', email: 'agus@example.com', role: 'QA Engineer', status: 'Active' },
  { id: 6, name: 'Rina Wati', email: 'rina@example.com', role: 'Designer', status: 'Inactive' },
  { id: 7, name: 'Joko Widodo', email: 'joko@example.com', role: 'Developer', status: 'Active' },
  { id: 8, name: 'Maya Sari', email: 'maya@example.com', role: 'Manager', status: 'Active' },
  { id: 9, name: 'Doni Kusuma', email: 'doni@example.com', role: 'Developer', status: 'Inactive' },
  { id: 10, name: 'Putri Anjani', email: 'putri@example.com', role: 'QA Engineer', status: 'Active' },
  { id: 11, name: 'Rudi Hartono', email: 'rudi@example.com', role: 'Designer', status: 'Active' },
  { id: 12, name: 'Sari Indah', email: 'sari@example.com', role: 'Developer', status: 'Inactive' },
  { id: 13, name: 'Eko Prasetyo', email: 'eko@example.com', role: 'Manager', status: 'Active' },
  { id: 14, name: 'Linda Pertiwi', email: 'linda@example.com', role: 'QA Engineer', status: 'Active' },
  { id: 15, name: 'Bambang Sutrisno', email: 'bambang@example.com', role: 'Developer', status: 'Active' },
];

// Pagination options
export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];
export const DEFAULT_ITEMS_PER_PAGE = 5;

// Role options for CRUD form
export const ROLE_OPTIONS = ['Developer', 'Designer', 'Manager', 'QA Engineer', 'DevOps'];

// Status options
export const STATUS_OPTIONS = ['Active', 'Inactive'];

// LocalStorage keys
export const STORAGE_KEYS = {
  AUTH: 'aksamedia_auth',
  USER: 'aksamedia_user',
  THEME: 'aksamedia_theme',
  DATA: 'aksamedia_data',
};
