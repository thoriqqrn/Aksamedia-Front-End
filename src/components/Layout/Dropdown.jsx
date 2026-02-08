import { useState, useRef, useEffect } from 'react';

/**
 * Custom Dropdown component (no library)
 */
function Dropdown({ 
  trigger, 
  children, 
  align = 'right',
  className = '' 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 min-w-[200px]
            bg-white dark:bg-gray-800 
            rounded-lg shadow-xl 
            border border-gray-200 dark:border-gray-700
            py-1 animate-slideDown
            ${alignmentClasses[align]}
          `}
        >
          {typeof children === 'function' 
            ? children({ close: () => setIsOpen(false) }) 
            : children}
        </div>
      )}
    </div>
  );
}

/**
 * Dropdown Item component
 */
export function DropdownItem({ children, onClick, className = '', danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-2 text-left text-sm
        flex items-center gap-2
        transition-colors duration-150
        ${danger 
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20' 
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
}

/**
 * Dropdown Divider
 */
export function DropdownDivider() {
  return <div className="border-t border-gray-200 dark:border-gray-700 my-1" />;
}

export default Dropdown;
