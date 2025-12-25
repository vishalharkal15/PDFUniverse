# PDFUniverse - Online PDF Tools SaaS

A production-ready SaaS web application for PDF manipulation, conversion, and editing.

🌐 **Live Demo:** [PDFUniverse](https://pdfuniverse.azurestaticapps.net)

## ✨ Features

### PDF Tools
- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Extract pages or split into multiple files
- **Compress PDF** - Reduce PDF file size
- **Rotate PDF** - Rotate pages 90°, 180°, 270°
- **Reorder Pages** - Drag & drop to rearrange PDF pages
- **PDF Editor** - Add text, annotations, and more

### Conversion Tools
- **PDF to Word** - Convert PDF to editable Word documents
- **PDF to Excel** - Extract tables from PDF to spreadsheets
- **PDF to JPG** - Convert PDF pages to images
- **Word to PDF** - Convert Word documents to PDF
- **Excel to PDF** - Convert spreadsheets to PDF
- **JPG to PDF** - Convert images to PDF

### Key Features
- 🚀 Fast processing with instant downloads
- 🔒 Privacy-first - Files auto-deleted after 30 minutes
- 📱 Fully responsive design
- 🎨 Modern, intuitive UI
- 🔍 SEO optimized

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Drag & Drop file upload
- react-helmet-async for SEO

### Backend
- Python FastAPI
- PyPDF2, pikepdf for PDF processing
- pdf2docx, python-docx for Word conversion
- tabula-py, openpyxl for Excel operations
- Pillow for image processing
- Azure Blob Storage / Local Storage

### Deployment
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- GitHub Actions CI/CD

## 📁 Project Structure

```
PDFUniverse/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── storage/         # File storage handlers
│   │   ├── core/            # Configuration
│   │   └── main.py          # App entry point
│   └── requirements.txt
├── frontend/                # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── App.jsx
│   └── package.json
└── .github/workflows/       # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Java Runtime (for tabula-py)

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Access the app at http://localhost:5173

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/merge` | POST | Merge multiple PDFs |
| `/api/split` | POST | Split PDF by page ranges |
| `/api/compress` | POST | Compress PDF file size |
| `/api/rotate` | POST | Rotate PDF pages |
| `/api/reorder` | POST | Reorder PDF pages |
| `/api/pdf-to-word` | POST | Convert PDF to Word |
| `/api/pdf-to-excel` | POST | Convert PDF to Excel |
| `/api/pdf-to-jpg` | POST | Convert PDF to images |
| `/api/word-to-pdf` | POST | Convert Word to PDF |
| `/api/excel-to-pdf` | POST | Convert Excel to PDF |
| `/api/jpg-to-pdf` | POST | Convert images to PDF |
| `/api/health` | GET | Health check |

## ☁️ Azure Deployment

### Backend (Azure App Service)
1. Create Python 3.10+ App Service
2. Set startup command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. Configure environment variables

### Frontend (Azure Static Web Apps)
1. Create Static Web App linked to GitHub
2. App location: `/frontend`, Output: `dist`
3. Set `VITE_API_BASE_URL` to backend URL

## 🔒 Security & Privacy

- ✅ Files automatically deleted after 30 minutes
- ✅ Random filename generation
- ✅ No user data retention
- ✅ HTTPS only in production
- ✅ Azure Blob Storage encryption at rest

## 👨‍💻 Author

**Vishal Harkal**
- Website: [vishalharkal.me](https://vishalharkal.me/)
- GitHub: [@vishalharkal15](https://github.com/vishalharkal15)

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

⭐ Star this repo if you find it useful!
