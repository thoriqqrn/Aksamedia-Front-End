import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import DataForm from '../components/CRUD/DataForm';

/**
 * Data Edit page
 */
function DataEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getItem, updateItem } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  // Load item data
  useEffect(() => {
    const data = getItem(id);
    if (data) {
      setItem(data);
    } else {
      setNotFound(true);
    }
  }, [id, getItem]);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    updateItem(id, formData);
    navigate('/data');
  };

  // Show not found state
  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Data Tidak Ditemukan
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Data dengan ID "{id}" tidak ditemukan dalam sistem.
          </p>
          <Link to="/data">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Kembali ke Data
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto animate-fadeIn">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-12 h-12 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <Link to="/data" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              Data
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 dark:text-white font-medium">Edit Data</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Data
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Perbarui informasi data "{item.name}"
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <DataForm
          initialData={item}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="edit"
        />
      </div>
    </div>
  );
}

export default DataEdit;
