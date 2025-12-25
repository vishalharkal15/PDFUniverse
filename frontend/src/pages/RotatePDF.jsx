import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { RotateCw } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function RotatePDF() {
  const [file, setFile] = useState(null)
  const [rotation, setRotation] = useState(90)
  const [pages, setPages] = useState('')
  const [allPages, setAllPages] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleFileSelected = (selectedFiles) => {
    setFile(selectedFiles[0])
    setError(null)
  }

  const handleRotate = async () => {
    if (!file) {
      setError('Please select a PDF file')
      return
    }

    if (!allPages && !pages.trim()) {
      setError('Please enter page ranges or select "All Pages"')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.rotatePDF(file, rotation, allPages ? null : pages)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to rotate PDF. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFile(null)
    setRotation(90)
    setPages('')
    setAllPages(true)
    setResult(null)
    setError(null)
    setProgress(0)
  }

  const structuredData = [
    generateToolSchema('Rotate PDF Online', 'Free online tool to rotate PDF pages by 90, 180, or 270 degrees. Fast, secure, and no signup required.', '/rotate'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Rotate PDF', url: '/rotate' }])
  ]

  return (
    <>
      <SEO
        title="Rotate PDF Online - Turn PDF Pages Free"
        description="Rotate PDF pages online for free. Turn pages by 90, 180, or 270 degrees easily. No signup required. Fast and secure PDF rotation tool."
        keywords="rotate pdf online, turn pdf pages, pdf rotator, rotate pdf pages, flip pdf, free pdf rotate"
        canonicalUrl="/rotate"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <RotateCw className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-orange-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Rotate PDF Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Rotate PDF pages by 90°, 180°, or 270°. Free and secure.
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
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Rotation Angle
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {[90, 180, 270].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={`py-2 sm:py-3 px-2 sm:px-4 rounded-lg border-2 transition-colors ${
                        rotation === angle
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <RotateCw className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1" />
                      <div className="font-semibold text-sm sm:text-base">{angle}°</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={allPages}
                    onChange={(e) => setAllPages(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">
                    Rotate all pages
                  </span>
                </label>

                {!allPages && (
                  <input
                    type="text"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="e.g., 1-3,5,7-9"
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                )}
              </div>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Rotating PDF...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {file && !loading && (
            <div className="text-center">
              <button onClick={handleRotate} className="btn-primary">
                Rotate PDF
              </button>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">Tips:</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-orange-800 space-y-1">
              <li>Select rotation angle (90°, 180°, or 270° clockwise)</li>
              <li>Choose to rotate all pages or specific page ranges</li>
              <li>Page ranges format: "1-3,5,7-9"</li>
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
