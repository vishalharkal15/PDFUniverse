from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file, format_file_size
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/compress")
async def compress_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    quality: str = Form("medium")
):
    """
    Compress a PDF file
    
    Args:
        file: PDF file to compress
        quality: Compression quality (low, medium, high)
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Validate quality parameter
        if quality not in ["low", "medium", "high"]:
            raise HTTPException(
                status_code=400,
                detail="Quality must be 'low', 'medium', or 'high'"
            )
        
        # Read file content
        content = await file.read()
        original_size = len(content)
        
        # Check file size
        if original_size > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit"
            )
        
        # Compress PDF
        compressed_pdf = await PDFService.compress_pdf(content, quality)
        compressed_size = len(compressed_pdf)
        
        # Calculate reduction percentage
        reduction = ((original_size - compressed_size) / original_size) * 100
        
        # Generate unique filename
        output_filename = generate_unique_filename("pdf")
        
        # Upload to Azure Blob Storage
        blob_url = await blob_storage.upload_file(
            compressed_pdf,
            output_filename,
            content_type="application/pdf"
        )
        
        # Schedule cleanup
        background_tasks.add_task(
            schedule_file_cleanup,
            output_filename
        )
        
        return {
            "success": True,
            "message": "PDF compressed successfully",
            "filename": output_filename,
            "download_url": blob_url,
            "original_size": original_size,
            "compressed_size": compressed_size,
            "original_size_formatted": format_file_size(original_size),
            "compressed_size_formatted": format_file_size(compressed_size),
            "reduction_percentage": round(reduction, 2),
            "quality": quality
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in compress endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def schedule_file_cleanup(filename: str):
    """Background task to cleanup file after retention period"""
    import asyncio
    await asyncio.sleep(settings.file_retention_minutes * 60)
    await blob_storage.delete_file(filename)
