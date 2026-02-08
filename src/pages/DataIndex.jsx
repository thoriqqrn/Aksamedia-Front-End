import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import Button from '../components/UI/Button';
import { ConfirmModal } from '../components/UI/Modal';
import SearchFilter from '../components/CRUD/SearchFilter';
import Pagination from '../components/CRUD/Pagination';
import { DEFAULT_ITEMS_PER_PAGE, ITEMS_PER_PAGE_OPTIONS } from '../utils/constants';

// Icons
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/**
 * Data Index page with CRUD operations, search, and pagination
 */
function DataIndex() {
  const { data, searchData, getPaginatedData, getTotalPages, deleteItem } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get initial values from URL query params
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page'), 10) || 1;
  const initialPerPage = parseInt(searchParams.get('perPage'), 10) || DEFAULT_ITEMS_PER_PAGE;

  const [search, setSearch] = useState(initialSearch);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(
    ITEMS_PER_PAGE_OPTIONS.includes(initialPerPage) ? initialPerPage : DEFAULT_ITEMS_PER_PAGE
  );
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });

  // Filter data based on search
  const filteredData = useMemo(() => {
    return searchData(search);
  }, [searchData, search]);

  // Get total pages
  const totalPages = useMemo(() => {
    return getTotalPages(filteredData, itemsPerPage);
  }, [filteredData, itemsPerPage, getTotalPages]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    return getPaginatedData(filteredData, currentPage, itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, getPaginatedData]);

  // Sync state with URL query params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (currentPage > 1) params.set('page', String(currentPage));
    if (itemsPerPage !== DEFAULT_ITEMS_PER_PAGE) params.set('perPage', String(itemsPerPage));
    
    setSearchParams(params, { replace: true });
  }, [search, currentPage, itemsPerPage, setSearchParams]);

  // Reset to page 1 when search changes or total pages decrease
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Handle search change
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Handle delete
  const handleDelete = useCallback(() => {
    if (deleteModal.item) {
      deleteItem(deleteModal.item.id);
      setDeleteModal({ isOpen: false, item: null });
    }
  }, [deleteModal.item, deleteItem]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Data Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola data dengan fitur CRUD, search, dan pagination
          </p>
        </div>
        <Link to="/data/create">
          <Button variant="primary">
            <PlusIcon />
            <span>Tambah Data</span>
          </Button>
        </Link>
      </div>

      {/* Search & Filters Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchFilter
              value={search}
              onChange={handleSearchChange}
              placeholder="Cari nama, email, role, atau status..."
            />
          </div>
          {search && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Ditemukan <span className="font-medium text-gray-900 dark:text-white">{filteredData.length}</span> hasil
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nama
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Email
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {item.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 md:hidden">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {item.email}
                    </td>
                    <td className="py-4 px-6 hidden sm:table-cell">
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {item.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`
                        inline-flex px-2.5 py-1 text-xs font-medium rounded-full
                        ${item.status === 'Active' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }
                      `}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/data/edit/${item.id}`}>
                          <button className="p-2 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <EditIcon />
                          </button>
                        </Link>
                        <button 
                          onClick={() => setDeleteModal({ isOpen: true, item })}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 dark:text-gray-400">
                        {search ? 'Tidak ada data yang sesuai dengan pencarian' : 'Belum ada data'}
                      </p>
                      {!search && (
                        <Link to="/data/create">
                          <Button variant="primary" size="sm">
                            <PlusIcon />
                            <span>Tambah Data Pertama</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={filteredData.length}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, item: null })}
        onConfirm={handleDelete}
        title="Hapus Data"
        message={`Apakah Anda yakin ingin menghapus data "${deleteModal.item?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />
    </div>
  );
}

export default DataIndex;
