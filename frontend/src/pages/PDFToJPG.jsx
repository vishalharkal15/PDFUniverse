import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { Image } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function PDFToJPG() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [format, setFormat] = useState('jpeg')
  const [dpi, setDpi] = useState(200)

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
      const data = await pdfService.pdfToJpg(files[0], format, dpi)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert PDF to images. Please try again.')
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
    generateToolSchema('PDF to JPG Converter', 'Free online tool to convert PDF pages to high-quality JPG images. Fast, secure, and no signup required.', '/pdf-to-jpg'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'PDF to JPG', url: '/pdf-to-jpg' }])
  ]

  return (
    <>
      <SEO
        title="PDF to JPG Converter - Convert PDF to Images Free"
        description="Convert PDF to JPG online for free. Transform PDF pages to high-quality images easily. No signup required. Fast and secure converter."
        keywords="pdf to jpg, convert pdf to image, pdf to jpeg, pdf to png, pdf image converter, free pdf to jpg"
        canonicalUrl="/pdf-to-jpg"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <Image className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-green-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PDF to JPG Converter</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Convert PDF pages to high-quality images. Free and secure.
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

          {files.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Conversion Options</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Image Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="jpeg">JPEG (smaller file size)</option>
                    <option value="png">PNG (better quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Resolution (DPI)
                  </label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="72">72 DPI (web)</option>
                    <option value="150">150 DPI (standard)</option>
                    <option value="200">200 DPI (good quality)</option>
                    <option value="300">300 DPI (high quality)</option>
                    <option value="600">600 DPI (print quality)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Converting PDF to images...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <div className="text-center">
              <button onClick={handleConvert} className="btn-primary">
                Convert to Images
              </button>
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-green-800 space-y-1">
              <li>Select a PDF file</li>
              <li>Choose image format and quality</li>
              <li>Click "Convert to Images"</li>
              <li>Download ZIP file with all images</li>
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
