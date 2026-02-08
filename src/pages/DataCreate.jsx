import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import DataForm from '../components/CRUD/DataForm';

/**
 * Data Create page
 */
function DataCreate() {
  const navigate = useNavigate();
  const { createItem } = useData();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    createItem(formData);
    navigate('/data');
  };

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
          <li className="text-gray-900 dark:text-white font-medium">Tambah Data</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tambah Data Baru
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Isi form di bawah untuk menambah data baru
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <DataForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          mode="create"
        />
      </div>
    </div>
  );
}

export default DataCreate;
