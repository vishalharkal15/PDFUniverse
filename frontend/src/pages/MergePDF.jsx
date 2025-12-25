import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { Merge } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function MergePDF() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles)
    setError(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.mergePDFs(files)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to merge PDFs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Merge PDF Online', 'Free online tool to combine multiple PDF files into one document. Fast, secure, and no signup required.', '/merge'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Merge PDF', url: '/merge' }])
  ]

  return (
    <>
      <SEO
        title="Merge PDF Online - Combine PDF Files Free"
        description="Merge PDF files online for free. Combine multiple PDFs into one document easily. No signup required. Fast, secure PDF merger tool."
        keywords="merge pdf online, combine pdf files, pdf merger, join pdf, concatenate pdf, free pdf merge"
        canonicalUrl="/merge"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <Merge className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Merge PDF Files Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Combine multiple PDF files into a single document. Free, fast, and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={true}
            selectedFiles={files}
          />

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Merging PDFs...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length >= 2 && !loading && (
            <div className="text-center">
              <button onClick={handleMerge} className="btn-primary">
                Merge {files.length} PDFs
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-blue-800 space-y-1">
              <li>Select 2 or more PDF files</li>
              <li>Files will be merged in the order you select them</li>
              <li>Click "Merge" to combine the files</li>
              <li>Download your merged PDF</li>
            </ol>
          </div>
        </div>
      ) : (
        <ResultDisplay result={result} onReset={handleReset} />
      )}
    </div>
    </>
  )
}
