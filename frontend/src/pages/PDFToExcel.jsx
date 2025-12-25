import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { FileSpreadsheet } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function PDFToExcel() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles.slice(0, 1)) // Only accept one file
    setError(null)
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.pdfToExcel(files[0])
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert PDF to Excel. Please try again.')
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
    generateToolSchema('PDF to Excel Converter', 'Free online tool to convert PDF tables to Excel spreadsheets. Fast, secure, and no signup required.', '/pdf-to-excel'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'PDF to Excel', url: '/pdf-to-excel' }])
  ]

  return (
    <>
      <SEO
        title="PDF to Excel Converter - Extract Tables Free"
        description="Convert PDF to Excel online for free. Extract tables from PDF documents to editable Excel spreadsheets. No signup required. Fast and secure."
        keywords="pdf to excel, convert pdf to xlsx, extract tables from pdf, pdf to spreadsheet, free pdf to excel converter"
        canonicalUrl="/pdf-to-excel"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <FileSpreadsheet className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PDF to Excel Converter</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Extract tables from your PDF files to editable Excel spreadsheets. Free and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={false}
            selectedFiles={files}
            accept=".pdf"
          />

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Converting PDF to Excel...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <div className="text-center">
              <button onClick={handleConvert} className="btn-primary">
                Convert to Excel
              </button>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-green-800 space-y-1">
              <li>Select a PDF file with tables</li>
              <li>Click "Convert to Excel"</li>
              <li>Download your Excel spreadsheet</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base">Note:</h3>
            <p className="text-xs sm:text-sm text-yellow-800">
              This tool works best with PDFs containing tabular data. Text-heavy documents may not convert as expected.
            </p>
          </div>
        </div>
      ) : (
        <ResultDisplay result={result} onReset={handleReset} />
      )}
    </div>
    </>
  )
}
