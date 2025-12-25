import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import MergePDF from './pages/MergePDF'
import SplitPDF from './pages/SplitPDF'
import CompressPDF from './pages/CompressPDF'
import RotatePDF from './pages/RotatePDF'
import ReorderPDF from './pages/ReorderPDF'
import PDFToWord from './pages/PDFToWord'
import PDFToJPG from './pages/PDFToJPG'
import JPGToPDF from './pages/JPGToPDF'
import PDFEditor from './pages/PDFEditor'
import PDFToExcel from './pages/PDFToExcel'
import ExcelToPDF from './pages/ExcelToPDF'
import WordToPDF from './pages/WordToPDF'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/merge" element={<MergePDF />} />
          <Route path="/split" element={<SplitPDF />} />
          <Route path="/compress" element={<CompressPDF />} />
          <Route path="/rotate" element={<RotatePDF />} />
          <Route path="/reorder" element={<ReorderPDF />} />
          <Route path="/pdf-to-word" element={<PDFToWord />} />
          <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
          <Route path="/edit" element={<PDFEditor />} />
          <Route path="/pdf-to-excel" element={<PDFToExcel />} />
          <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
          <Route path="/word-to-pdf" element={<WordToPDF />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
