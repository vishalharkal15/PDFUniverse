from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file, parse_page_ranges
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/split")
async def split_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    pages: str = Form(...)
):
    """
    Extract specific pages from a PDF
    
    Args:
        file: PDF file to split
        pages: Page ranges (e.g., "1-3,5,7-9")
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit"
            )
        
        # Get PDF info to validate pages
        pdf_info = PDFService.get_pdf_info(content)
        total_pages = pdf_info["pages"]
        
        # Parse page ranges
        try:
            page_indices = parse_page_ranges(pages, total_pages)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        
        # Split PDF
        split_pdf = await PDFService.split_pdf(content, page_indices)
        
        # Generate unique filename
        output_filename = generate_unique_filename("pdf")
        
        # Upload to Azure Blob Storage
        blob_url = await blob_storage.upload_file(
            split_pdf,
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
            "message": "PDF split successfully",
            "filename": output_filename,
            "download_url": blob_url,
            "file_size": len(split_pdf),
            "pages_extracted": len(page_indices),
            "original_pages": total_pages
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in split endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def schedule_file_cleanup(filename: str):
    """Background task to cleanup file after retention period"""
    import asyncio
    await asyncio.sleep(settings.file_retention_minutes * 60)
    await blob_storage.delete_file(filename)
