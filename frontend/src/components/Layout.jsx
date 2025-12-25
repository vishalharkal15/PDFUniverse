import { Link } from 'react-router-dom'
import { FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { path: '/merge', label: 'Merge' },
    { path: '/split', label: 'Split' },
    { path: '/compress', label: 'Compress' },
    { path: '/pdf-to-word', label: 'PDF to Word' },
    { path: '/pdf-to-jpg', label: 'PDF to JPG' },
    { path: '/jpg-to-pdf', label: 'JPG to PDF' },
    { path: '/edit', label: 'Editor' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2">
              <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-primary-600" />
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">PDFUniverse</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-4 xl:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-gray-600 hover:text-primary-600 transition text-sm font-medium whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <nav className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition text-center border border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-600">
            <p className="mb-1.5 sm:mb-2 text-sm sm:text-base">© 2025 PDFUniverse. All rights reserved.</p>
            <p className="text-xs sm:text-sm mb-1.5 sm:mb-2">Files are automatically deleted after 30 minutes. Privacy-first design.</p>
            <p className="text-xs sm:text-sm text-gray-500">Developed by <a href="https://vishalharkal.me/" target="_blank" rel="noopener noreferrer" className="font-medium text-gray-700 hover:text-red-600 transition-colors">@Vishal Harkal</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
