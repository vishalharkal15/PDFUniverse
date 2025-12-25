import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'

export default function FileUpload({ 
  onFilesSelected, 
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  maxSize = 50 * 1024 * 1024, // 50MB
  selectedFiles = []
}) {
  const onDrop = useCallback((acceptedFiles) => {
    onFilesSelected(acceptedFiles)
  }, [onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize
  })

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    onFilesSelected(newFiles)
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mb-3 sm:mb-4" />
        {isDragActive ? (
          <p className="text-base sm:text-lg text-primary-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-1 sm:mb-2">
              Drag & drop {multiple ? 'PDF files' : 'a PDF file'} here
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">or</p>
            <button className="btn-primary text-sm sm:text-base">
              Select {multiple ? 'Files' : 'File'}
            </button>
            <p className="text-xs text-gray-500 mt-3 sm:mt-4">Max file size: 50MB</p>
          </div>
        )}
      </div>

      {/* Selected Files Display */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 sm:mt-6 space-y-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length}):</h3>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <File className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                  <span className="text-gray-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="ml-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
