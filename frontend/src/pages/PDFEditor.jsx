import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { Edit3, Droplets, Hash } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function PDFEditor() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState('watermark') // 'watermark' or 'pagenumbers'
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [opacity, setOpacity] = useState(0.3)
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-center')

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles.slice(0, 1))
    setError(null)
  }

  const handleEdit = async () => {
    if (files.length === 0) {
      setError('Please select a PDF file')
      return
    }

    if (editMode === 'watermark' && !watermarkText.trim()) {
      setError('Please enter watermark text')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      let data
      if (editMode === 'watermark') {
        data = await pdfService.addWatermark(files[0], watermarkText, opacity)
      } else {
        data = await pdfService.addPageNumbers(files[0], pageNumberPosition)
      }
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to edit PDF. Please try again.')
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
    generateToolSchema('PDF Editor Online', 'Free online PDF editor to add watermarks and page numbers. Fast, secure, and no signup required.', '/edit'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'PDF Editor', url: '/edit' }])
  ]

  return (
    <>
      <SEO
        title="PDF Editor Online - Add Watermarks & Page Numbers Free"
        description="Edit PDF files online for free. Add watermarks and page numbers to your PDF documents easily. No signup required. Fast and secure PDF editor."
        keywords="pdf editor online, add watermark to pdf, add page numbers pdf, free pdf editor, edit pdf online"
        canonicalUrl="/edit"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <Edit3 className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-purple-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PDF Editor Online</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Add watermarks or page numbers to your PDF. Free and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          {/* Edit Mode Selector */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
            <button
              onClick={() => setEditMode('watermark')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                editMode === 'watermark'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Droplets className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Watermark
            </button>
            <button
              onClick={() => setEditMode('pagenumbers')}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                editMode === 'pagenumbers'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Hash className="h-4 w-4 sm:h-5 sm:w-5" />
              Add Page Numbers
            </button>
          </div>

          <FileUpload
            onFilesSelected={handleFilesSelected}
            multiple={false}
            selectedFiles={files}
            accept=".pdf"
          />

          {files.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                {editMode === 'watermark' ? 'Watermark Options' : 'Page Number Options'}
              </h3>
              
              {editMode === 'watermark' ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Watermark Text
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Enter watermark text"
                      maxLength={50}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum 50 characters</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Opacity: {Math.round(opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Light</span>
                      <span>Dark</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    Position
                  </label>
                  <select
                    value={pageNumberPosition}
                    onChange={(e) => setPageNumberPosition(e.target.value)}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="bottom-center">Bottom Center</option>
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                {editMode === 'watermark' ? 'Adding watermark...' : 'Adding page numbers...'}
              </p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <div className="text-center">
              <button onClick={handleEdit} className="btn-primary">
                {editMode === 'watermark' ? 'Add Watermark' : 'Add Page Numbers'}
              </button>
            </div>
          )}

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-purple-900 mb-2 text-sm sm:text-base">Features:</h3>
            <ul className="list-disc list-inside text-xs sm:text-sm text-purple-800 space-y-1">
              <li><strong>Watermark:</strong> Add diagonal text watermark to all pages</li>
              <li><strong>Page Numbers:</strong> Add "Page X of Y" to all pages</li>
              <li>Customize opacity and position</li>
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
