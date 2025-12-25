# Backend Development Guide

## Local Setup

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)
- Azure Storage Account (for production)

### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Linux/Mac:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Azure Storage credentials:
   ```
   AZURE_STORAGE_CONNECTION_STRING=your_connection_string
   AZURE_STORAGE_CONTAINER_NAME=pdf-files
   MAX_FILE_SIZE_MB=50
   FILE_RETENTION_MINUTES=30
   CORS_ORIGINS=http://localhost:5173
   ENVIRONMENT=development
   ```

6. **Run the development server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access the API**
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── routes/          # API endpoint definitions
│   │       ├── merge.py     # Merge PDFs
│   │       ├── split.py     # Split PDFs
│   │       ├── compress.py  # Compress PDFs
│   │       ├── rotate.py    # Rotate PDFs
│   │       ├── reorder.py   # Reorder pages
│   │       └── health.py    # Health check
│   ├── services/            # Business logic
│   │   └── pdf_service.py   # PDF operations
│   ├── storage/             # Storage integrations
│   │   └── azure_blob.py    # Azure Blob Storage
│   ├── core/                # Core configuration
│   │   └── config.py        # App settings
│   ├── utils/               # Utility functions
│   │   └── helpers.py       # Helper functions
│   └── main.py              # FastAPI application
├── requirements.txt         # Python dependencies
└── .env.example            # Environment template
```

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### PDF Operations
- **POST** `/api/merge` - Merge multiple PDFs
- **POST** `/api/split` - Split PDF by page ranges
- **POST** `/api/compress` - Compress PDF file
- **POST** `/api/rotate` - Rotate PDF pages
- **POST** `/api/reorder` - Reorder PDF pages

## Azure App Service Deployment

### Configuration

1. **Create Azure App Service**
   ```bash
   az webapp create \
     --resource-group your-resource-group \
     --plan your-app-service-plan \
     --name your-app-name \
     --runtime "PYTHON:3.10"
   ```

2. **Configure startup command**
   In Azure Portal → Configuration → General Settings:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

3. **Add Application Settings**
   In Azure Portal → Configuration → Application Settings:
   - `AZURE_STORAGE_CONNECTION_STRING`
   - `AZURE_STORAGE_CONTAINER_NAME`
   - `MAX_FILE_SIZE_MB`
   - `FILE_RETENTION_MINUTES`
   - `CORS_ORIGINS`
   - `ENVIRONMENT=production`

4. **Deploy via GitHub Actions**
   - Get publish profile from Azure Portal
   - Add as `AZURE_WEBAPP_PUBLISH_PROFILE` secret in GitHub
   - Push to main branch to trigger deployment

## Development Tips

### Testing API Locally
Use the interactive docs at http://localhost:8000/docs to test endpoints.

### Debugging
Check logs with:
```bash
# Local
Check terminal output

# Azure
az webapp log tail --name your-app-name --resource-group your-resource-group
```

### Common Issues

**Issue:** Module not found errors
- **Solution:** Ensure virtual environment is activated and dependencies installed

**Issue:** Azure Storage connection errors
- **Solution:** Verify connection string in .env file

**Issue:** CORS errors
- **Solution:** Add frontend URL to CORS_ORIGINS in .env

## Production Checklist

- [ ] Set `ENVIRONMENT=production` in Azure App Settings
- [ ] Configure proper CORS origins
- [ ] Set up Azure Storage container
- [ ] Test all API endpoints
- [ ] Monitor logs for errors
- [ ] Set up Application Insights (optional)
