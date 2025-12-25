import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { Scissors } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function SplitPDF() {
  const [file, setFile] = useState(null)
  const [pages, setPages] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0])
    setError(null)
  }

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    if (!pages.trim()) {
      setError('Please enter page ranges (e.g., "1-3,5,7-9")')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.splitPDF(file, pages)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to split PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPages('')
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Split PDF Online', 'Free online tool to split PDF files and extract pages. Fast, secure, and no signup required.', '/split'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Split PDF', url: '/split' }])
  ]

  return (
    <>
      <SEO
        title="Split PDF Online - Extract Pages Free"
        description="Split PDF files online for free. Extract specific pages from your PDF documents easily. No signup required. Fast and secure PDF splitter."
        keywords="split pdf online, extract pdf pages, pdf splitter, separate pdf pages, free pdf split"
        canonicalUrl="/split"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <Scissors className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Split PDF Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Extract specific pages from your PDF. Free, fast, and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          <FileUpload
            onFilesSelected={handleFileSelected}
            multiple={false}
            selectedFiles={file ? [file] : []}
          />

          {file && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Page Ranges
              </label>
              <input
                type="text"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="e.g., 1-3,5,7-9"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter page numbers or ranges separated by commas
              </p>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Splitting PDF...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {file && !loading && (
            <div className="text-center">
              <button onClick={handleSplit} className="btn-primary">
                Split PDF
              </button>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Examples:</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-green-800 space-y-1">
              <li><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs">1-3</code> - Pages 1 to 3</li>
              <li><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs">5</code> - Only page 5</li>
              <li><code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs">1-3,5,7-9</code> - Pages 1-3, 5, and 7-9</li>
            </ul>
          </div>
        </div>
      ) : (
        <ResultDisplay result={result} onReset={handleReset} />
      )}
    </div>
    </>
  )
}
