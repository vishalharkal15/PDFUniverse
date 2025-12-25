from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from typing import Optional
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/add-watermark")
async def add_watermark(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    watermark_text: str = Form(...),
    opacity: float = Form(default=0.3)
):
    """
    Add text watermark to PDF
    
    Upload a PDF file and add a diagonal text watermark to all pages
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Validate watermark text
        if not watermark_text or len(watermark_text.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Watermark text is required"
            )
        
        if len(watermark_text) > 50:
            raise HTTPException(
                status_code=400,
                detail="Watermark text must be 50 characters or less"
            )
        
        # Validate opacity
        if opacity < 0.1 or opacity > 1.0:
            raise HTTPException(
                status_code=400,
                detail="Opacity must be between 0.1 and 1.0"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed ({settings.max_file_size}MB)"
            )
        
        # Add watermark
        watermarked_content = await PDFService.add_watermark(content, watermark_text.strip(), opacity)
        
        # Generate filename and save
        output_filename = generate_unique_filename("pdf")
        download_url = await blob_storage.upload_file(
            watermarked_content,
            output_filename,
            content_type="application/pdf"
        )
        
        # Schedule cleanup
        background_tasks.add_task(
            blob_storage.delete_file,
            output_filename,
            delay_seconds=settings.file_retention_minutes * 60
        )
        
        return {
            "success": True,
            "message": "Watermark added successfully",
            "download_url": download_url,
            "filename": output_filename,
            "watermark": watermark_text.strip()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in add watermark endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add watermark: {str(e)}"
        )


@router.post("/add-page-numbers")
async def add_page_numbers(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    position: str = Form(default="bottom-center")
):
    """
    Add page numbers to PDF
    
    Upload a PDF file and add page numbers to all pages
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Validate position
        valid_positions = ["bottom-center", "bottom-right", "bottom-left"]
        if position not in valid_positions:
            raise HTTPException(
                status_code=400,
                detail=f"Position must be one of: {', '.join(valid_positions)}"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed ({settings.max_file_size}MB)"
            )
        
        # Add page numbers
        numbered_content = await PDFService.add_page_numbers(content, position)
        
        # Generate filename and save
        output_filename = generate_unique_filename("pdf")
        download_url = await blob_storage.upload_file(
            numbered_content,
            output_filename,
            content_type="application/pdf"
        )
        
        # Schedule cleanup
        background_tasks.add_task(
            blob_storage.delete_file,
            output_filename,
            delay_seconds=settings.file_retention_minutes * 60
        )
        
        return {
            "success": True,
            "message": "Page numbers added successfully",
            "download_url": download_url,
            "filename": output_filename,
            "position": position
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in add page numbers endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to add page numbers: {str(e)}"
        )
