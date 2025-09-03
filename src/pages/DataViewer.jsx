
import { useState, useMemo, useEffect } from 'react'
import { Search, Filter, Download, Eye, EyeOff, ChevronDown, ChevronUp, Database, AlertCircle } from 'lucide-react'

/**
 * DataViewer Page Component
 * 
 * Displays datasets from localStorage in a table format with advanced filtering and search capabilities.
 * Supports sorting, filtering by multiple criteria, and data export.
 * 
 * Features:
 * - Load datasets from localStorage
 * - Responsive data table
 * - Advanced filtering system
 * - Search functionality
 * - Column sorting
 * - Data export options
 * - Pagination
 */
function DataViewer() {
  const [datasets, setDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState(null)
  const [data, setData] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({})
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState({})
  const [showDatasetSelector, setShowDatasetSelector] = useState(false)

  // Load datasets from localStorage on component mount
  useEffect(() => {
    loadDatasets()
  }, [])

  // Load datasets from localStorage
  const loadDatasets = () => {
    try {
      const storedDatasets = localStorage.getItem('dataviewer_datasets')
      if (storedDatasets) {
        const parsedDatasets = JSON.parse(storedDatasets)
        setDatasets(parsedDatasets)
        
        // Auto-select first dataset if available
        if (parsedDatasets.length > 0 && !selectedDataset) {
          selectDataset(parsedDatasets[0])
        }
      }
    } catch (error) {
      console.error('Error loading datasets from localStorage:', error)
    }
  }

  // Select a dataset to view
  const selectDataset = (dataset) => {
    setSelectedDataset(dataset)
    
    // Convert dataset data to table format
    let tableData = []
    if (dataset.type === 'csv') {
      tableData = dataset.data.data.map((row, index) => ({
        id: index + 1,
        ...row
      }))
    } else {
      tableData = dataset.data.map((row, index) => ({
        id: index + 1,
        ...row
      }))
    }
    
    setData(tableData)
    
    // Set up visible columns
    const columns = dataset.columns || []
    const columnVisibility = {}
    columns.forEach(col => {
      columnVisibility[col] = true
    })
    columnVisibility.id = true
    setVisibleColumns(columnVisibility)
    
    // Reset filters and search
    setSearchTerm('')
    setFilters({})
    setCurrentPage(1)
    setSortConfig({ key: null, direction: 'asc' })
  }

  // Get unique values for filter options dynamically
  const getUniqueValues = (column) => {
    if (!data.length) return []
    return [...new Set(data.map(item => item[column]).filter(Boolean))]
  }

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data.filter(item => {
      const matchesSearch = Object.values(item).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
      
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true
        return item[key] === value
      })
      
      return matchesSearch && matchesFilters
    })

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        
        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        } else {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
        }
      })
    }

    return filtered
  }, [data, searchTerm, filters, sortConfig])

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }))
    setCurrentPage(1)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  // Export data
  const exportData = (format) => {
    if (!filteredData.length) return
    
    const dataToExport = filteredData.map(item => {
      const exportRow = {}
      Object.keys(visibleColumns).forEach(col => {
        if (visibleColumns[col]) {
          const displayName = col === 'id' ? 'ID' : col.charAt(0).toUpperCase() + col.slice(1)
          exportRow[displayName] = item[col]
        }
      })
      return exportRow
    })
    
    if (format === 'csv') {
      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${selectedDataset?.name || 'dataset'}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  // Toggle column visibility
  const toggleColumn = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-primary-500/25">
            <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Data Viewer
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Explore and analyze your datasets with advanced filtering and search.
          </p>
        </div>

        {/* Dataset Selection */}
        {datasets.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {/* Dataset Selector */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Select Dataset</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Choose a dataset to view and analyze
                  </p>
                </div>
                <button
                  onClick={() => setShowDatasetSelector(!showDatasetSelector)}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {showDatasetSelector ? 'Hide' : 'Show'} Datasets
                </button>
              </div>

              {/* Current Dataset Info */}
              {selectedDataset && (
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{selectedDataset.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedDataset.rowCount} rows • {selectedDataset.type.toUpperCase()} • 
                        Created {new Date(selectedDataset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {data.length} total rows
                      </p>
                      <p className="text-xs text-gray-500">
                        {Object.keys(visibleColumns).filter(col => visibleColumns[col]).length} columns visible
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Dataset List */}
              {showDatasetSelector && (
                <div className="mt-4 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {datasets.map((dataset) => (
                    <div
                      key={dataset.id}
                      onClick={() => selectDataset(dataset)}
                      className={`bg-white border-2 rounded-lg sm:rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedDataset?.id === dataset.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                            {dataset.name}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            {dataset.rowCount} rows • {dataset.type.toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(dataset.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search across all fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white text-sm sm:text-base"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Filters
                </button>
                
                <button
                  onClick={() => exportData('csv')}
                  disabled={!selectedDataset || !filteredData.length}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </button>
              </div>

              {/* Dynamic Filters Panel */}
              {showFilters && selectedDataset && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(visibleColumns).map((column) => {
                      if (column === 'id') return null
                      const uniqueValues = getUniqueValues(column)
                      if (uniqueValues.length === 0) return null
                      
                      return (
                        <div key={column}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {column}
                          </label>
                          <select
                            value={filters[column] || ''}
                            onChange={(e) => handleFilterChange(column, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm"
                          >
                            <option value="">All {column}</option>
                            {uniqueValues.map(value => (
                              <option key={value} value={value}>{value}</option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Column Visibility Toggle */}
            {selectedDataset && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Column Visibility</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.entries(visibleColumns).map(([column, isVisible]) => (
                    <label key={column} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleColumn(column)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {column === 'id' ? 'ID' : column}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Results Summary */}
            {selectedDataset && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 gap-2">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} results
                </span>
                {Object.values(filters).some(f => f !== '') && (
                  <span className="text-primary-600">
                    Filters applied
                  </span>
                )}
              </div>
            )}

            {/* Data Table */}
            {selectedDataset ? (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.entries(visibleColumns).map(([column, isVisible]) => {
                          if (!isVisible) return null
                          return (
                            <th
                              key={column}
                              className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                              onClick={() => handleSort(column)}
                            >
                              <div className="flex items-center space-x-1">
                                <span className="capitalize">
                                  {column === 'id' ? 'ID' : column}
                                </span>
                                {sortConfig.key === column && (
                                  sortConfig.direction === 'asc' ? 
                                    <ChevronUp className="w-4 h-4" /> : 
                                    <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </th>
                          )
                        })}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentData.map((item, index) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                          {Object.entries(visibleColumns).map(([column, isVisible]) => {
                            if (!isVisible) return null
                            return (
                              <td key={column} className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {item[column]}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty State */}
                {currentData.length === 0 && (
                  <div className="text-center py-12">
                    <EyeOff className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No data found matching your criteria.</p>
                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <Database className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Dataset Selected</h3>
                <p className="text-gray-600">Please select a dataset from the list above to start viewing data.</p>
              </div>
            )}

            {/* Pagination */}
            {selectedDataset && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Demo Info */}
            {datasets.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  <div className="ml-3 sm:ml-4">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Local Storage Mode</h3>
                    <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
                      Your datasets are loaded from browser localStorage. You can filter, sort, and search through your data,
                      and export filtered results as CSV files. All data remains private to your device.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Datasets Message */
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center">
            <Database className="mx-auto h-16 w-16 text-blue-400 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-blue-900 mb-2">No Datasets Available</h3>
            <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
              You haven't uploaded any datasets yet. Go to the Data Upload page to create your first dataset.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataViewer