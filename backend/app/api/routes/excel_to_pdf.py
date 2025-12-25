from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import logging
import uuid
import asyncio

from app.services.pdf_service import PDFService
from app.storage.local_storage import LocalFileStorage
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)
storage = LocalFileStorage()
pdf_service = PDFService()


async def schedule_file_cleanup(blob_name: str, delay_seconds: int):
    """Background task to delete file after delay"""
    await asyncio.sleep(delay_seconds)
    await storage.delete_file(blob_name)
    logger.info(f"Cleaned up file: {blob_name}")


@router.post("/excel-to-pdf")
async def convert_excel_to_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Convert Excel document to PDF
    
    Converts Excel spreadsheet to a formatted PDF document.
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Only Excel files (.xlsx, .xls) are allowed")
        
        # Check file size
        content = await file.read()
        if len(content) > settings.max_file_size_mb * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit"
            )
        
        # Convert Excel to PDF
        pdf_content = await pdf_service.excel_to_pdf(content)
        
        # Generate unique filename
        output_filename = f"converted_{uuid.uuid4().hex[:8]}.pdf"
        
        # Save to storage
        blob_name = await storage.upload_file(
            pdf_content,
            output_filename,
            "application/pdf"
        )
        
        # Schedule deletion as background task (non-blocking)
        background_tasks.add_task(
            schedule_file_cleanup,
            blob_name,
            settings.file_retention_minutes * 60
        )
        
        # Get download URL
        download_url = storage.get_download_url(blob_name)
        
        logger.info(f"Converted Excel to PDF: {output_filename}")
        
        return JSONResponse({
            "success": True,
            "message": "Excel converted to PDF successfully",
            "download_url": download_url,
            "filename": output_filename
        })
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error converting Excel to PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))
