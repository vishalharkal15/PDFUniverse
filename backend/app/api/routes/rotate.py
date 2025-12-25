from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from typing import Optional
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file, parse_page_ranges
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/rotate")
async def rotate_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    rotation: int = Form(...),
    pages: Optional[str] = Form(None)
):
    """
    Rotate PDF pages
    
    Args:
        file: PDF file to rotate
        rotation: Rotation angle (90, 180, 270)
        pages: Optional page ranges (e.g., "1-3,5"). If not provided, rotates all pages
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Validate rotation angle
        if rotation not in [90, 180, 270]:
            raise HTTPException(
                status_code=400,
                detail="Rotation must be 90, 180, or 270 degrees"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit"
            )
        
        # Get PDF info
        pdf_info = PDFService.get_pdf_info(content)
        total_pages = pdf_info["pages"]
        
        # Parse page ranges if provided
        page_indices = None
        if pages:
            try:
                page_indices = parse_page_ranges(pages, total_pages)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        
        # Rotate PDF
        rotated_pdf = await PDFService.rotate_pdf(content, rotation, page_indices)
        
        # Generate unique filename
        output_filename = generate_unique_filename("pdf")
        
        # Upload to Azure Blob Storage
        blob_url = await blob_storage.upload_file(
            rotated_pdf,
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
            "message": f"PDF rotated {rotation}° successfully",
            "filename": output_filename,
            "download_url": blob_url,
            "file_size": len(rotated_pdf),
            "total_pages": total_pages,
            "pages_rotated": len(page_indices) if page_indices else total_pages,
            "rotation": rotation
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in rotate endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def schedule_file_cleanup(filename: str):
    """Background task to cleanup file after retention period"""
    import asyncio
    await asyncio.sleep(settings.file_retention_minutes * 60)
    await blob_storage.delete_file(filename)
