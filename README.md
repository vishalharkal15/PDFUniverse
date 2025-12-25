# iHitPDF - Online PDF Tools

A production-ready web application for PDF manipulation, similar to iLovePDF.

## Features

- **Merge PDF** - Combine multiple PDFs into one
- **Split PDF** - Extract pages or split into multiple files
- **Compress PDF** - Reduce PDF file size
- **Rotate PDF** - Rotate pages 90°, 180°, 270°
- **Reorder Pages** - Rearrange PDF pages
- **Download** - Get your processed files instantly

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS
- Drag & Drop file upload
- Progress indicators

### Backend
- Python FastAPI
- PyPDF2, pikepdf for PDF processing
- Azure Blob Storage
- Background task processing

### Cloud & Deployment
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- GitHub Actions CI/CD
- No Docker required

## Project Structure

```
ihitpdf/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/routes/
│   │   ├── services/
│   │   ├── storage/
│   │   ├── core/
│   │   └── main.py
│   └── requirements.txt
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── .github/workflows/
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Azure account
- GitHub account

### Local Development

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with Azure credentials
cp .env.example .env

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Run development server
npm run dev
```

### Azure Configuration

#### 1. Azure Blob Storage
- Create a Storage Account
- Create a container named `pdf-files`
- Get connection string from Access Keys
- Add to backend `.env`:
  ```
  AZURE_STORAGE_CONNECTION_STRING=your_connection_string
  AZURE_STORAGE_CONTAINER_NAME=pdf-files
  ```

#### 2. Azure App Service (Backend)
- Create Python 3.10+ App Service
- Set startup command: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Add environment variables in Configuration > Application Settings

#### 3. Azure Static Web Apps (Frontend)
- Create Static Web App
- Connect to GitHub repository
- Build configuration:
  - App location: `/frontend`
  - Output location: `dist`

### GitHub Actions Deployment

The project includes automated CI/CD workflows:
- `backend-deploy.yml` - Deploys FastAPI to Azure App Service
- `frontend-deploy.yml` - Deploys React app to Azure Static Web Apps

Configure these secrets in GitHub:
- `AZURE_WEBAPP_PUBLISH_PROFILE` (Backend)
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (Frontend)

## Environment Variables

### Backend (.env)
```
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER_NAME=pdf-files
MAX_FILE_SIZE_MB=50
FILE_RETENTION_MINUTES=30
CORS_ORIGINS=https://your-frontend-url.azurestaticapps.net
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend.azurewebsites.net
```

## API Endpoints

- `POST /api/merge` - Merge multiple PDFs
- `POST /api/split` - Split PDF by page ranges
- `POST /api/compress` - Compress PDF file size
- `POST /api/rotate` - Rotate PDF pages
- `POST /api/reorder` - Reorder PDF pages
- `GET /api/health` - Health check

## Security & Privacy

- Files are automatically deleted after 30 minutes
- Random filename generation
- No user data retention
- Azure Blob Storage encryption at rest
- HTTPS only in production

## License

MIT License - See LICENSE file for details
# PDFUniverse
