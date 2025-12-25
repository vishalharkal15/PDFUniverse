import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { FileText } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function PDFToWord() {
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
      setError('Please select a PDF file to convert')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.pdfToWord(files[0])
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert PDF to Word. Please try again.')
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
    generateToolSchema('PDF to Word Converter', 'Free online tool to convert PDF files to editable Word documents. Fast, secure, and no signup required.', '/pdf-to-word'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'PDF to Word', url: '/pdf-to-word' }])
  ]

  return (
    <>
      <SEO
        title="PDF to Word Converter - Convert PDF to DOCX Free"
        description="Convert PDF to Word online for free. Transform your PDF files to editable DOCX documents easily. No signup required. Fast and secure converter."
        keywords="pdf to word, convert pdf to docx, pdf to word converter, pdf converter online, free pdf to word"
        canonicalUrl="/pdf-to-word"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <FileText className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-blue-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PDF to Word Converter</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Convert your PDF files to editable Word documents (DOCX). Free and secure.
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
              <p className="text-xs sm:text-sm text-gray-600 text-center">Converting PDF to Word...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <div className="text-center">
              <button onClick={handleConvert} className="btn-primary">
                Convert to Word
              </button>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-blue-800 space-y-1">
              <li>Select a PDF file</li>
              <li>Click "Convert to Word"</li>
              <li>Download your editable Word document</li>
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
