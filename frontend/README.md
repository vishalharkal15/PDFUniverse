# Frontend Development Guide

## Local Setup

### Prerequisites
- Node.js 18 or higher
- npm (comes with Node.js)

### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.jsx       # Main layout
│   │   ├── FileUpload.jsx   # Drag & drop upload
│   │   ├── ProgressBar.jsx  # Progress indicator
│   │   ├── ResultDisplay.jsx # Success screen
│   │   └── ErrorMessage.jsx  # Error display
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── MergePDF.jsx     # Merge tool
│   │   ├── SplitPDF.jsx     # Split tool
│   │   ├── CompressPDF.jsx  # Compress tool
│   │   ├── RotatePDF.jsx    # Rotate tool
│   │   └── ReorderPDF.jsx   # Reorder tool
│   ├── services/            # API services
│   │   └── api.js           # API client
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS config
└── package.json             # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Azure Static Web Apps Deployment

### Setup

1. **Create Static Web App**
   ```bash
   az staticwebapp create \
     --name your-static-app-name \
     --resource-group your-resource-group \
     --source https://github.com/your-username/your-repo \
     --location "eastus2" \
     --branch main \
     --app-location "/frontend" \
     --output-location "dist"
   ```

2. **Get deployment token**
   ```bash
   az staticwebapp secrets list \
     --name your-static-app-name \
     --resource-group your-resource-group \
     --query "properties.apiKey" -o tsv
   ```

3. **Add GitHub Secrets**
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` - Deployment token
   - `VITE_API_BASE_URL` - Your backend API URL

4. **Deploy**
   Push to main branch to trigger automatic deployment

### Configuration

Create `staticwebapp.config.json` in frontend root for routing:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    }
  ],
  "mimeTypes": {
    ".json": "application/json"
  }
}
```

## Development Tips

### Hot Module Replacement
Vite provides fast HMR - changes appear instantly in the browser.

### Environment Variables
All environment variables must be prefixed with `VITE_`:
- Development: `.env`
- Production: Set in Azure Static Web Apps Configuration

### Tailwind CSS
Use utility classes for styling. Check `tailwind.config.js` for custom colors.

### API Integration
All API calls are in `src/services/api.js`. The base URL is set from environment variables.

## Component Guidelines

### File Upload Component
```jsx
<FileUpload
  onFilesSelected={handleFiles}
  multiple={true}
  selectedFiles={files}
/>
```

### Progress Bar
```jsx
<ProgressBar progress={75} />
```

### Result Display
```jsx
<ResultDisplay 
  result={data} 
  onReset={handleReset} 
/>
```

### Error Message
```jsx
<ErrorMessage 
  error="Something went wrong" 
  onDismiss={() => setError(null)} 
/>
```

## Production Checklist

- [ ] Update `VITE_API_BASE_URL` to production backend
- [ ] Test all PDF tools
- [ ] Verify file upload works (check size limits)
- [ ] Test download functionality
- [ ] Check mobile responsiveness
- [ ] Verify error handling
- [ ] Test across different browsers

## Common Issues

**Issue:** API calls fail with CORS errors
- **Solution:** Ensure backend CORS_ORIGINS includes frontend URL

**Issue:** Environment variables not working
- **Solution:** Restart dev server after changing .env file

**Issue:** Build fails
- **Solution:** Run `npm ci` to clean install dependencies

**Issue:** Static Web App routing issues
- **Solution:** Add `staticwebapp.config.json` with navigation fallback
