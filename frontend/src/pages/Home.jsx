import { Link } from 'react-router-dom'
import { Merge, Scissors, Minimize2, RotateCw, ArrowUpDown, FileText, Image, FileImage, Edit3, Shield, Zap, Clock, CheckCircle, FileSpreadsheet } from 'lucide-react'
import SEO, { generateWebsiteSchema, generateOrganizationSchema, generateFAQSchema } from '../components/SEO'

export default function Home() {
  const tools = [
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDFs into one document',
      icon: Merge,
      path: '/merge',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Split PDF',
      description: 'Extract pages or split into multiple files',
      icon: Scissors,
      path: '/split',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Compress PDF',
      description: 'Reduce PDF file size',
      icon: Minimize2,
      path: '/compress',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      name: 'PDF to Word',
      description: 'Convert PDF to editable Word document',
      icon: FileText,
      path: '/pdf-to-word',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      name: 'Word to PDF',
      description: 'Convert Word documents to PDF',
      icon: FileText,
      path: '/word-to-pdf',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'PDF to Excel',
      description: 'Extract tables from PDF to Excel',
      icon: FileSpreadsheet,
      path: '/pdf-to-excel',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Excel to PDF',
      description: 'Convert Excel spreadsheets to PDF',
      icon: FileSpreadsheet,
      path: '/excel-to-pdf',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      name: 'PDF to JPG',
      description: 'Convert PDF pages to images',
      icon: Image,
      path: '/pdf-to-jpg',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    },
    {
      name: 'JPG to PDF',
      description: 'Convert images to PDF document',
      icon: FileImage,
      path: '/jpg-to-pdf',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      name: 'PDF Editor',
      description: 'Add watermarks and page numbers',
      icon: Edit3,
      path: '/edit',
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    {
      name: 'Rotate PDF',
      description: 'Rotate pages 90°, 180°, or 270°',
      icon: RotateCw,
      path: '/rotate',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      name: 'Reorder Pages',
      description: 'Rearrange PDF pages in custom order',
      icon: ArrowUpDown,
      path: '/reorder',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ]

  const faqs = [
    {
      question: "Are the PDF tools completely free to use?",
      answer: "Yes, all PDF tools on PDFUniverse are 100% free. No registration, no hidden fees, and no limitations on usage."
    },
    {
      question: "Is my data secure when using PDFUniverse?",
      answer: "Absolutely. All files are processed securely and automatically deleted within 30 minutes. We never store or share your documents."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF files for all tools. For image conversion, we accept JPG, PNG, GIF, BMP, WebP, and TIFF formats."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account or signup is required. Simply upload your files and start using our tools immediately."
    }
  ]

  const combinedSchema = [
    generateWebsiteSchema(),
    generateOrganizationSchema(),
    generateFAQSchema(faqs)
  ]

  return (
    <>
      <SEO
        title="Free Online PDF Tools - Merge, Split, Compress PDFs"
        description="PDFUniverse offers free online PDF tools to merge, split, compress, convert, and edit PDF files. No signup required. Fast, secure, and easy to use."
        keywords="online pdf tools, merge pdf online, split pdf online, compress pdf online, pdf converter online, free pdf editor, pdf to word, jpg to pdf"
        canonicalUrl="/"
        structuredData={combinedSchema}
      />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="text-center mb-10 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
          Free Online PDF Tools
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          Merge, split, compress, and edit your PDFs easily. 
          No registration required. Files are automatically deleted after 30 minutes.
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="card hover:border-primary-300 hover:shadow-lg transition-all group p-3 sm:p-4 md:p-6"
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 ${tool.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className={`h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 ${tool.color}`} />
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              {tool.name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Features Section */}
      <section className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
        <div className="p-4">
          <Shield className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Secure & Private</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Files are encrypted and automatically deleted after 30 minutes
          </p>
        </div>
        <div className="p-4">
          <Zap className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Fast Processing</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Process your PDFs in seconds with our optimized backend
          </p>
        </div>
        <div className="p-4">
          <CheckCircle className="h-8 w-8 text-primary-600 mx-auto mb-2" />
          <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">100% Free</h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            No subscriptions, no hidden fees, completely free to use
          </p>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="mt-12 sm:mt-16 bg-gray-50 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6">
          Why Choose PDFUniverse?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center">
            <Clock className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700">Files Auto-Deleted</span>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700">No Signup Required</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700">Fast & Reliable</span>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
            <span className="text-xs sm:text-sm text-gray-700">Privacy-First</span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-6 sm:mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="bg-white border border-gray-200 rounded-lg p-4 group">
              <summary className="font-medium text-gray-900 cursor-pointer text-sm sm:text-base list-none flex justify-between items-center">
                {faq.question}
                <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600 text-xs sm:text-sm">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-12 sm:mt-16 prose prose-sm sm:prose max-w-none">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
          The Best Free Online PDF Tools
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          PDFUniverse provides a comprehensive suite of free online PDF tools designed to help you work with PDF documents efficiently. 
          Whether you need to merge multiple PDF files into one, split a large PDF into smaller parts, compress PDFs to reduce file size, 
          or convert between PDF and other formats, our tools make it simple and fast.
        </p>
        <p className="text-gray-600 text-sm sm:text-base mt-3">
          All our PDF tools work directly in your browser – no software installation required. Your files are processed securely and 
          automatically deleted within 30 minutes to ensure your privacy. Join millions of users who trust PDFUniverse for their 
          everyday PDF needs.
        </p>
      </section>
    </div>
    </>
  )
}
