import { useState, useRef, useEffect } from 'react'
import { Upload, FileText, Plus, X, CheckCircle, AlertCircle, Database, Trash2, Eye } from 'lucide-react'

/**
 * DataUpload Page Component
 * 
 * Provides interface for uploading CSV files and manually entering data.
 * Supports drag & drop, file selection, and manual data entry with localStorage persistence.
 * 
 * Features:
 * - CSV file upload with drag & drop
 * - Manual data entry with dynamic columns
 * - LocalStorage data persistence
 * - Dataset management
 * - Modern SaaS UI design
 * - File validation and preview
 */
function DataUpload() {
  const [uploadMethod, setUploadMethod] = useState('csv') // 'csv' or 'manual'
  const [csvData, setCsvData] = useState(null)
  const [manualData, setManualData] = useState([])
  const [columns, setColumns] = useState(['Column 1', 'Column 2', 'Column 3'])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [datasetName, setDatasetName] = useState('')
  const [savedDatasets, setSavedDatasets] = useState([])
  const [showSavedDatasets, setShowSavedDatasets] = useState(false)
  const fileInputRef = useRef(null)

  // Load saved datasets on component mount
  useEffect(() => {
    loadSavedDatasets()
  }, [])

  // LocalStorage functions
  const loadSavedDatasets = () => {
    try {
      const datasets = localStorage.getItem('dataviewer_datasets')
      if (datasets) {
        setSavedDatasets(JSON.parse(datasets))
      }
    } catch (error) {
      console.error('Error loading datasets from localStorage:', error)
    }
  }

  const saveDataset = (data, name, type) => {
    try {
      const datasets = JSON.parse(localStorage.getItem('dataviewer_datasets') || '[]')
      const newDataset = {
        id: Date.now().toString(),
        name: name || `Dataset ${datasets.length + 1}`,
        type,
        data,
        columns: type === 'csv' ? data.headers : columns,
        createdAt: new Date().toISOString(),
        rowCount: type === 'csv' ? data.data.length : data.length
      }
      
      const updatedDatasets = [...datasets, newDataset]
      localStorage.setItem('dataviewer_datasets', JSON.stringify(updatedDatasets))
      setSavedDatasets(updatedDatasets)
      return newDataset.id
    } catch (error) {
      console.error('Error saving dataset to localStorage:', error)
      return null
    }
  }

  const deleteDataset = (id) => {
    try {
      const datasets = JSON.parse(localStorage.getItem('dataviewer_datasets') || '[]')
      const updatedDatasets = datasets.filter(dataset => dataset.id !== id)
      localStorage.setItem('dataviewer_datasets', JSON.stringify(updatedDatasets))
      setSavedDatasets(updatedDatasets)
    } catch (error) {
      console.error('Error deleting dataset:', error)
    }
  }

  // Handle CSV file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'text/csv') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const csv = e.target.result
        const lines = csv.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        const data = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',').map(v => v.trim())
          const row = {}
          headers.forEach((header, index) => {
            row[header] = values[index] || ''
          })
          return row
        })
        
        setCsvData({ headers, data })
        setColumns(headers)
      }
      reader.readAsText(file)
    }
  }

  // Handle drag and drop
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'text/csv') {
      const event = { target: { files: [file] } }
      handleFileUpload(event)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  // Manual data entry functions
  const addColumn = () => {
    setColumns([...columns, `Column ${columns.length + 1}`])
  }

  const removeColumn = (index) => {
    if (columns.length > 1) {
      const newColumns = columns.filter((_, i) => i !== index)
      setColumns(newColumns)
      
      // Update manual data to match new columns
      const newManualData = manualData.map(row => {
        const newRow = {}
        newColumns.forEach((col, i) => {
          newRow[col] = row[columns[i]] || ''
        })
        return newRow
      })
      setManualData(newManualData)
    }
  }

  const updateColumnName = (index, newName) => {
    const newColumns = [...columns]
    newColumns[index] = newName
    setColumns(newColumns)
    
    // Update manual data to match new column names
    const oldColumnName = columns[index]
    const newManualData = manualData.map(row => {
      const newRow = { ...row }
      if (newRow[oldColumnName] !== undefined) {
        newRow[newName] = newRow[oldColumnName]
        delete newRow[oldColumnName]
      }
      return newRow
    })
    setManualData(newManualData)
  }

  const addRow = () => {
    const newRow = {}
    columns.forEach(col => {
      newRow[col] = ''
    })
    setManualData([...manualData, newRow])
  }

  const removeRow = (index) => {
    setManualData(manualData.filter((_, i) => i !== index))
  }

  const updateCell = (rowIndex, column, value) => {
    const newData = [...manualData]
    newData[rowIndex][column] = value
    setManualData(newData)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!datasetName.trim()) {
      alert('Please enter a dataset name')
      return
    }
    
    setIsUploading(true)
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save to localStorage
    let dataToSave, typeToSave
    if (uploadMethod === 'csv' && csvData) {
      dataToSave = csvData
      typeToSave = 'csv'
    } else if (uploadMethod === 'manual' && manualData.length > 0) {
      dataToSave = manualData
      typeToSave = 'manual'
    }
    
    if (dataToSave) {
      const savedId = saveDataset(dataToSave, datasetName, typeToSave)
      if (savedId) {
        setIsUploading(false)
        setUploadSuccess(true)
        
        // Reset form after success
        setTimeout(() => {
          setUploadSuccess(false)
          resetForm()
        }, 3000)
      } else {
        setIsUploading(false)
        alert('Error saving dataset. Please try again.')
      }
    } else {
      setIsUploading(false)
      alert('Please add some data before saving.')
    }
  }

  const resetForm = () => {
    setCsvData(null)
    setManualData([])
    setColumns(['Column 1', 'Column 2', 'Column 3'])
    setUploadSuccess(false)
    setDatasetName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Modern Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-lg shadow-primary-500/25">
            <Database className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Import Your Data
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Upload CSV files or create datasets manually. Your data is stored securely in your browser.
          </p>
        </div>

        {/* Saved Datasets Toggle */}
        {savedDatasets.length > 0 && (
          <div className="mb-6 sm:mb-8 text-center">
            <button
              onClick={() => setShowSavedDatasets(!showSavedDatasets)}
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors duration-200 text-sm sm:text-base"
            >
              <Eye className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{showSavedDatasets ? 'Hide' : 'View'} Saved Datasets</span>
              <span className="sm:hidden">Datasets</span>
              <span className="ml-1">({savedDatasets.length})</span>
            </button>
          </div>
        )}

        {/* Saved Datasets List */}
        {showSavedDatasets && savedDatasets.length > 0 && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6 sm:mb-8 animate-fade-in">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Saved Datasets</h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {savedDatasets.map((dataset) => (
                <div key={dataset.id} className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{dataset.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {dataset.rowCount} rows • {dataset.type.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(dataset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteDataset(dataset.id)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200 ml-2 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Upload Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Upload Method Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setUploadMethod('csv')}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium transition-all duration-200 text-sm sm:text-base ${
                  uploadMethod === 'csv'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">CSV Upload</span>
                <span className="sm:hidden">CSV</span>
              </button>
              <button
                onClick={() => setUploadMethod('manual')}
                className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium transition-all duration-200 text-sm sm:text-base ${
                  uploadMethod === 'manual'
                    ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Manual Entry</span>
                <span className="sm:hidden">Manual</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Success Message */}
            {uploadSuccess && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 animate-slide-up">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <h3 className="text-base sm:text-lg font-semibold text-green-800">
                      Dataset saved successfully!
                    </h3>
                    <p className="text-green-700 mt-1 text-sm sm:text-base">
                      Your data has been saved to local storage and is ready for analysis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Dataset Name Input */}
            <div className="mb-6 sm:mb-8">
              <label htmlFor="dataset-name" className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                Dataset Name
              </label>
              <input
                id="dataset-name"
                type="text"
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                placeholder="Enter a name for your dataset..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-gray-50 focus:bg-white text-sm sm:text-base"
              />
            </div>

            {/* CSV Upload Section */}
            {uploadMethod === 'csv' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Enhanced Drag & Drop Zone */}
                <div
                  className="relative border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center hover:border-primary-300 hover:bg-primary-25 transition-all duration-300 group cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                        Upload CSV File
                      </h3>
                      <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                        Drag and drop your CSV file here, or click to browse
                      </p>
                      <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium text-sm sm:text-base">
                        Choose File
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Supports CSV files up to 10MB
                    </p>
                  </div>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </div>

                {/* CSV Preview */}
                {csvData && (
                  <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Data Preview</h3>
                      <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium self-start sm:self-auto">
                        {csvData.data.length} rows
                      </div>
                    </div>
                    <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full min-w-[600px] sm:min-w-[800px]">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              {csvData.headers.map((header, index) => (
                                <th
                                  key={index}
                                  className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {csvData.data.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                                {csvData.headers.map((header, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 whitespace-nowrap"
                                  >
                                    {row[header]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {csvData.data.length > 5 && (
                        <div className="bg-gray-50 px-3 sm:px-4 py-2 border-t border-gray-100">
                          <p className="text-xs sm:text-sm text-gray-600 text-center">
                            Showing first 5 of {csvData.data.length} total rows
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Entry Section */}
            {uploadMethod === 'manual' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Column Setup */}
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Column Setup</h3>
                    <button
                      type="button"
                      onClick={addColumn}
                      className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Column
                    </button>
                  </div>

                  {/* Column Headers */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {columns.map((column, index) => (
                      <div key={index} className="flex items-center space-x-2 sm:space-x-3">
                        <input
                          type="text"
                          value={column}
                          onChange={(e) => updateColumnName(index, e.target.value)}
                          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white text-sm sm:text-base"
                          placeholder="Column name"
                        />
                        {columns.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors duration-200"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Rows */}
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Data Entry</h3>
                    <button
                      type="button"
                      onClick={addRow}
                      className="inline-flex items-center px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg sm:rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium text-sm sm:text-base"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Row
                    </button>
                  </div>

                  {manualData.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      </div>
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No data rows yet</h4>
                      <p className="text-gray-600 text-sm sm:text-base">Click "Add Row" to start entering your data.</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto max-w-full">
                        <table className="w-full min-w-[600px] sm:min-w-[800px]">
                          <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                              {columns.map((column, index) => (
                                <th
                                  key={index}
                                  className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap"
                                >
                                  {column}
                                </th>
                              ))}
                              <th className="px-3 sm:px-4 py-2 text-left text-xs sm:text-sm font-semibold text-gray-900 w-16 sm:w-20">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {manualData.map((row, rowIndex) => (
                              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors duration-150">
                                {columns.map((column, colIndex) => (
                                  <td key={colIndex} className="px-3 sm:px-4 py-2">
                                    <input
                                      type="text"
                                      value={row[column] || ''}
                                      onChange={(e) => updateCell(rowIndex, column, e.target.value)}
                                      className="w-full px-2 sm:px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm"
                                      placeholder={`Enter ${column}`}
                                    />
                                  </td>
                                ))}
                                <td className="px-3 sm:px-4 py-2">
                                  <button
                                    type="button"
                                    onClick={() => removeRow(rowIndex)}
                                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-6 sm:pt-8 border-t border-gray-100 gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                Reset
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setUploadMethod(uploadMethod === 'csv' ? 'manual' : 'csv')}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Switch to {uploadMethod === 'csv' ? 'Manual Entry' : 'CSV Upload'}</span>
                  <span className="sm:hidden">Switch to {uploadMethod === 'csv' ? 'Manual' : 'CSV'}</span>
                </button>
                
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isUploading || (!csvData && manualData.length === 0) || !datasetName.trim()}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg sm:rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg shadow-primary-500/25 text-sm sm:text-base"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 inline-block"></div>
                      <span className="hidden sm:inline">Saving Dataset...</span>
                      <span className="sm:hidden">Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Save Dataset</span>
                      <span className="sm:hidden">Save</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
            <div className="ml-3 sm:ml-4">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">Local Storage Mode</h3>
              <p className="text-blue-800 leading-relaxed text-sm sm:text-base">
                Your datasets are stored securely in your browser's local storage. They will persist 
                between sessions and remain private to your device. You can upload CSV files or create 
                datasets manually - both methods support unlimited rows and columns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataUpload
