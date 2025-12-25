import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { Minimize2 } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function CompressPDF() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0])
    setError(null)
  }

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.compressPDF(file, quality)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to compress PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setQuality('medium')
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Compress PDF Online', 'Free online tool to reduce PDF file size while maintaining quality. Fast, secure, and no signup required.', '/compress'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Compress PDF', url: '/compress' }])
  ]

  return (
    <>
      <SEO
        title="Compress PDF Online - Reduce File Size Free"
        description="Compress PDF files online for free. Reduce PDF file size while maintaining quality. No signup required. Fast and secure PDF compressor."
        keywords="compress pdf online, reduce pdf size, pdf compressor, shrink pdf, optimize pdf, free pdf compression"
        canonicalUrl="/compress"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <Minimize2 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-purple-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Compress PDF Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Reduce PDF file size while maintaining quality. Free and secure.
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Compression Quality
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                {['low', 'medium', 'high'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition-colors ${
                      quality === q
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="font-semibold capitalize text-sm sm:text-base">{q}</div>
                    <div className="text-xs text-gray-500 mt-1 hidden sm:block">
                      {q === 'low' && 'Max compression'}
                      {q === 'medium' && 'Balanced'}
                      {q === 'high' && 'Best quality'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Compressing PDF...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {file && !loading && (
            <div className="text-center">
              <button onClick={handleCompress} className="btn-primary">
                Compress PDF
              </button>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Compression Levels:</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-purple-800 space-y-1">
              <li><strong>Low:</strong> Maximum compression, slight quality loss</li>
              <li><strong>Medium:</strong> Balanced compression and quality</li>
              <li><strong>High:</strong> Minimal compression, best quality</li>
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
