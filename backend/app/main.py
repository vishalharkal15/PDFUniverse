from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
import logging
import sys
import os

from app.core.config import settings
from app.api.routes import merge, split, compress, rotate, reorder, health, pdf_to_word, pdf_to_jpg, jpg_to_pdf, edit, pdf_to_excel, excel_to_pdf, word_to_pdf
from app.storage.local_storage import UPLOAD_DIR

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="Online PDF manipulation tools - Merge, Split, Compress, Rotate, and more",
    docs_url="/docs" if settings.environment == "development" else None,
    redoc_url="/redoc" if settings.environment == "development" else None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "An internal error occurred",
            "detail": str(exc) if settings.environment == "development" else None
        }
    )


# Include routers
app.include_router(health.router, prefix="/api", tags=["Health"])
app.include_router(merge.router, prefix="/api", tags=["PDF Operations"])
app.include_router(split.router, prefix="/api", tags=["PDF Operations"])
app.include_router(compress.router, prefix="/api", tags=["PDF Operations"])
app.include_router(rotate.router, prefix="/api", tags=["PDF Operations"])
app.include_router(reorder.router, prefix="/api", tags=["PDF Operations"])
app.include_router(pdf_to_word.router, prefix="/api", tags=["Conversion"])
app.include_router(pdf_to_jpg.router, prefix="/api", tags=["Conversion"])
app.include_router(jpg_to_pdf.router, prefix="/api", tags=["Conversion"])
app.include_router(pdf_to_excel.router, prefix="/api", tags=["Conversion"])
app.include_router(excel_to_pdf.router, prefix="/api", tags=["Conversion"])
app.include_router(word_to_pdf.router, prefix="/api", tags=["Conversion"])
app.include_router(edit.router, prefix="/api", tags=["PDF Editor"])


@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info(f"Starting {settings.app_name} v{settings.version}")
    logger.info(f"Environment: {settings.environment}")
    logger.info(f"Max file size: {settings.max_file_size_mb}MB")
    logger.info(f"File retention: {settings.file_retention_minutes} minutes")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("Shutting down application")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": settings.app_name,
        "version": settings.version,
        "status": "running",
        "docs": "/docs" if settings.environment == "development" else None
    }


@app.get("/api/download/{filename}")
async def download_file(filename: str):
    """Download a processed PDF file"""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type="application/pdf",
            filename=filename,
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    return JSONResponse(status_code=404, content={"detail": "File not found"})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.environment == "development"
    )
