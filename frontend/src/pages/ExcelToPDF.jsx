import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { FileSpreadsheet, Upload, X } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function ExcelToPDF() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  const handleConvert = async () => {
    if (!file) {
      setError('Please select an Excel file')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.excelToPdf(file)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert Excel to PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Excel to PDF Converter', 'Free online tool to convert Excel spreadsheets to PDF documents. Fast, secure, and no signup required.', '/excel-to-pdf'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Excel to PDF', url: '/excel-to-pdf' }])
  ]

  return (
    <>
      <SEO
        title="Excel to PDF Converter - Convert XLSX to PDF Free"
        description="Convert Excel to PDF online for free. Transform your spreadsheets to PDF documents easily. No signup required. Fast and secure converter."
        keywords="excel to pdf, convert xlsx to pdf, spreadsheet to pdf, xls to pdf, free excel to pdf converter"
        canonicalUrl="/excel-to-pdf"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <FileSpreadsheet className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-emerald-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Excel to PDF Converter</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Convert your Excel spreadsheets to PDF documents. Free and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            {isDragActive ? (
              <p className="text-sm sm:text-base text-emerald-600 font-medium">Drop the Excel file here...</p>
            ) : (
              <>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">
                  Drag & drop an Excel file here, or click to select
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Supports .xlsx and .xls files
                </p>
              </>
            )}
          </div>

          {file && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Converting Excel to PDF...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {file && !loading && (
            <div className="text-center">
              <button onClick={handleConvert} className="btn-primary">
                Convert to PDF
              </button>
            </div>
          )}

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-emerald-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-emerald-800 space-y-1">
              <li>Select or drag & drop your Excel file</li>
              <li>Click "Convert to PDF"</li>
              <li>Download your PDF document</li>
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
