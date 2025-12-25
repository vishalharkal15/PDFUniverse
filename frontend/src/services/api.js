import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

export const pdfService = {
  // Merge PDFs
  mergePDFs: async (files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    const response = await api.post('/api/merge', formData)
    return response.data
  },

  // Split PDF
  splitPDF: async (file, pages) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('pages', pages)
    
    const response = await api.post('/api/split', formData)
    return response.data
  },

  // Compress PDF
  compressPDF: async (file, quality = 'medium') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('quality', quality)
    
    const response = await api.post('/api/compress', formData)
    return response.data
  },

  // Rotate PDF
  rotatePDF: async (file, rotation, pages = null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('rotation', rotation.toString())
    if (pages) {
      formData.append('pages', pages)
    }
    
    const response = await api.post('/api/rotate', formData)
    return response.data
  },

  // Reorder PDF
  reorderPDF: async (file, pageOrder) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('page_order', JSON.stringify(pageOrder))
    
    const response = await api.post('/api/reorder', formData)
    return response.data
  },

  // PDF to Word
  pdfToWord: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/pdf-to-word', formData)
    return response.data
  },

  // PDF to JPG
  pdfToJpg: async (file, format = 'jpeg', dpi = 200) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('format', format)
    formData.append('dpi', dpi.toString())
    
    const response = await api.post('/api/pdf-to-jpg', formData)
    return response.data
  },

  // JPG to PDF
  jpgToPdf: async (files) => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    
    const response = await api.post('/api/jpg-to-pdf', formData)
    return response.data
  },

  // Add Watermark
  addWatermark: async (file, watermarkText, opacity = 0.3) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('watermark_text', watermarkText)
    formData.append('opacity', opacity.toString())
    
    const response = await api.post('/api/add-watermark', formData)
    return response.data
  },

  // Add Page Numbers
  addPageNumbers: async (file, position = 'bottom-center') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('position', position)
    
    const response = await api.post('/api/add-page-numbers', formData)
    return response.data
  },

  // PDF to Excel
  pdfToExcel: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/pdf-to-excel', formData)
    return response.data
  },

  // Excel to PDF
  excelToPdf: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/excel-to-pdf', formData)
    return response.data
  },

  // Word to PDF
  wordToPdf: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/api/word-to-pdf', formData)
    return response.data
  },

  // Health check
  healthCheck: async () => {
    const response = await api.get('/api/health')
    return response.data
  },
}

export default api
