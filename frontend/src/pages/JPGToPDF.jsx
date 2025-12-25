import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import ProgressBar from '../components/ProgressBar'
import ResultDisplay from '../components/ResultDisplay'
import ErrorMessage from '../components/ErrorMessage'
import { pdfService } from '../services/api'
import { FileImage, Upload, X } from 'lucide-react'
import SEO, { generateToolSchema, generateBreadcrumbSchema } from '../components/SEO'

export default function JPGToPDF() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prev) => [...prev, ...acceptedFiles])
    setError(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/bmp': ['.bmp'],
      'image/webp': ['.webp'],
      'image/tiff': ['.tiff', '.tif']
    },
    multiple: true
  })

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one image file')
      return
    }

    setLoading(true)
    setProgress(20)
    setError(null)

    try {
      setProgress(50)
      const data = await pdfService.jpgToPdf(files)
      setProgress(100)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to convert images to PDF. Please try again.')
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
    generateToolSchema('JPG to PDF Converter', 'Free online tool to convert images to PDF documents. Fast, secure, and no signup required.', '/jpg-to-pdf'),
    generateBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'JPG to PDF', url: '/jpg-to-pdf' }])
  ]

  return (
    <>
      <SEO
        title="JPG to PDF Converter - Convert Images to PDF Free"
        description="Convert JPG, PNG, and other images to PDF online for free. Create PDF documents from your images easily. No signup required. Fast and secure."
        keywords="jpg to pdf, image to pdf, convert jpg to pdf, png to pdf, picture to pdf, free jpg to pdf converter"
        canonicalUrl="/jpg-to-pdf"
        structuredData={structuredData}
      />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <header className="text-center mb-6 sm:mb-8">
        <FileImage className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-orange-600 mx-auto mb-3 sm:mb-4" aria-hidden="true" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">JPG to PDF Converter</h1>
        <p className="text-sm sm:text-base text-gray-600 px-2">
          Convert images to a PDF document. Free and secure.
        </p>
      </header>

      {!result ? (
        <div className="space-y-4 sm:space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            {isDragActive ? (
              <p className="text-sm sm:text-base text-orange-600 font-medium">Drop the images here...</p>
            ) : (
              <>
                <p className="text-sm sm:text-base text-gray-600 font-medium mb-1">
                  Drag & drop images here, or click to select
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Supports JPG, PNG, GIF, BMP, WebP, TIFF
                </p>
              </>
            )}
          </div>

          {files.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                Selected Images ({files.length})
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                Images will be converted in the order shown below
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {files.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-0.5 sm:p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <ErrorMessage error={error} onDismiss={() => setError(null)} />}

          {loading && (
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-gray-600 text-center">Converting images to PDF...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          {files.length > 0 && !loading && (
            <div className="text-center">
              <button onClick={handleConvert} className="btn-primary">
                Convert {files.length} Image{files.length > 1 ? 's' : ''} to PDF
              </button>
            </div>
          )}

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-orange-900 mb-2 text-sm sm:text-base">How to use:</h3>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-orange-800 space-y-1">
              <li>Select or drag & drop your images</li>
              <li>Arrange them in the desired order</li>
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
