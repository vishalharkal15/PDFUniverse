import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { ArrowUpDown } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function ReorderPDF() {
  const [file, setFile] = useState(null)
  const [pageOrder, setPageOrder] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0])
    setError(null)
  }

  const handleReorder = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    if (!pageOrder.trim()) {
      setError('Please enter the new page order')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      // Parse page order
      const pages = pageOrder.split(',').map(p => parseInt(p.trim()))
      
      setProgress(50)
      const data = await pdfService.reorderPDF(file, pages)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reorder PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageOrder('')
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Reorder PDF Pages', 'Free online tool to rearrange PDF pages in any custom order. Fast, secure, and no signup required.', '/reorder'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Reorder PDF', url: '/reorder' }])
  ]

  return (
    <>
      <SEO
        title="Reorder PDF Pages - Rearrange PDF Online Free"
        description="Reorder PDF pages online for free. Rearrange pages in your PDF documents in any custom order. No signup required. Fast and secure."
        keywords="reorder pdf pages, rearrange pdf, pdf page order, organize pdf pages, free pdf reorder"
        canonicalUrl="/reorder"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <ArrowUpDown className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-pink-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Reorder PDF Pages Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Rearrange pages in your PDF in any custom order. Free and secure.
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Page Order
              </label>
              <input
                type="text"
                value={pageOrder}
                onChange={(e) => setPageOrder(e.target.value)}
                placeholder="e.g., 3,1,2,4"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter page numbers in the desired order, separated by commas
              </p>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Reordering pages...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {file && !loading && (
            <div className="text-center">
              <button onClick={handleReorder} className="btn-primary">
                Reorder Pages
              </button>
            </div>
          )}

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-pink-900 mb-2 text-sm sm:text-base">Example:</h3>
            <div className="text-xs sm:text-sm text-pink-800 space-y-2">
              <p>If your PDF has pages 1, 2, 3, 4:</p>
              <ul className="list-disc list-inside ml-2 sm:ml-4 space-y-1">
                <li className="break-words">
                  <code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm">3,1,2,4</code> 
                  <span className="ml-1">moves page 3 to front</span>
                </li>
                <li className="break-words">
                  <code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm">4,3,2,1</code> 
                  <span className="ml-1">reverses the order</span>
                </li>
                <li className="break-words">
                  <code className="bg-white px-1.5 sm:px-2 py-0.5 rounded text-xs sm:text-sm">1,3,2,4</code> 
                  <span className="ml-1">swaps pages 2 and 3</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <ResultDisplay result={result} onReset={handleReset} />
      )}
    </div>
    </>
  )
}
