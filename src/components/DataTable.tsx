import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { ExcelData } from '../types';

interface DataTableProps {
  data: ExcelData;
  onSelectColumn: (column: string) => void;
  selectedColumn: string | null;
}

const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  onSelectColumn, 
  selectedColumn 
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  // Calculate total pages
  const totalPages = Math.ceil(data.rows.length / rowsPerPage);
  
  // Sort data if needed
  const sortedRows = useMemo(() => {
    let sortableRows = [...data.rows];
    
    if (sortConfig) {
      sortableRows.sort((a, b) => {
        if (a[sortConfig.key] === undefined || a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === undefined || b[sortConfig.key] === null) return -1;
        
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableRows;
  }, [data.rows, sortConfig]);
  
  // Get current page data
  const currentRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedRows.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedRows, currentPage, rowsPerPage]);
  
  // Request sort
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Get sort direction icon
  const getSortDirectionIcon = (column: string) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <ChevronRight className="w-4 h-4 opacity-30" />;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4" />
      : <ChevronDown className="w-4 h-4" />;
  };
  
  // Handle column selection
  const handleColumnClick = (column: string) => {
    onSelectColumn(column);
  };
  
  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      {/* Table Container with horizontal scroll */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {data.headers.map((column, index) => (
                <th 
                  key={index}
                  onClick={() => requestSort(column)}
                  className={`
                    px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
                    cursor-pointer hover:bg-gray-100 transition-colors duration-150 ease-in-out
                    ${selectedColumn === column ? 'bg-primary-50 text-primary-700' : ''}
                  `}
                >
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleColumnClick(column);
                      }}
                      className={`
                        flex-grow text-left
                        ${selectedColumn === column ? 'font-bold text-primary-700' : 'font-medium text-gray-500'}
                      `}
                    >
                      {column}
                    </button>
                    <span className="ml-1 inline-flex">
                      {getSortDirectionIcon(column)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
              >
                {data.headers.map((column, colIndex) => (
                  <td 
                    key={`${rowIndex}-${colIndex}`}
                    className={`
                      px-4 py-3 whitespace-nowrap text-sm 
                      ${selectedColumn === column ? 'bg-primary-50' : ''}
                    `}
                  >
                    {row[column] !== undefined && row[column] !== null
                      ? String(row[column])
                      : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`
                relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
                ${currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`
                ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
                ${currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}
              `}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{Math.min(1 + (currentPage - 1) * rowsPerPage, data.rows.length)}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * rowsPerPage, data.rows.length)}</span> of{' '}
                <span className="font-medium">{data.rows.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className={`
                    relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">First</span>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`
                    relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium
                    ${currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    // Show all pages if total pages are 5 or less
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    // Show first 5 pages
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Show last 5 pages
                    pageNumber = totalPages - 4 + i;
                  } else {
                    // Show current page and 2 pages before and after
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`
                        relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${currentPage === pageNumber
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}
                      `}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`
                    relative inline-flex items-center px-2 py-2 border border-gray-300 text-sm font-medium
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">Next</span>
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`
                    relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium
                    ${currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-500 hover:bg-gray-50'}
                  `}
                >
                  <span className="sr-only">Last</span>
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;