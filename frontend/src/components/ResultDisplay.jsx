import { Download, CheckCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function ResultDisplay({ result, onReset }) {
  if (!result) return null

  // Construct full download URL
  const downloadUrl = result.download_url.startsWith('http') 
    ? result.download_url 
    : `${API_BASE_URL}${result.download_url}`

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-semibold text-center mb-2">
        {result.message || 'Success!'}
      </h3>
      
      {result.compressed_size && result.original_size && (
        <div className="text-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          <p>Original: {result.original_size_formatted}</p>
          <p>Compressed: {result.compressed_size_formatted}</p>
          <p className="text-green-600 font-semibold">
            Reduced by {result.reduction_percentage}%
          </p>
        </div>
      )}
      
      {result.pages_count && (
        <p className="text-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
          {result.pages_count} pages processed
        </p>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6">
        <a
          href={downloadUrl}
          download={result.filename}
          className="btn-primary inline-flex items-center justify-center text-sm sm:text-base"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Download
        </a>
        <button onClick={onReset} className="btn-secondary text-sm sm:text-base">
          Process Another
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-3 sm:mt-4">
        File will be automatically deleted after 30 minutes
      </p>
    </div>
  )
}
