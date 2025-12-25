import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex items-start">
      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
      <div className="flex-grow min-w-0">
        <h4 className="text-xs sm:text-sm font-medium text-red-800">Error</h4>
        <p className="text-xs sm:text-sm text-red-700 mt-1 break-words">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-2 sm:ml-4 text-lg sm:text-xl"
        >
          ×
        </button>
      )}
    </div>
  )
}
