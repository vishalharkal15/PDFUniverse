from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from typing import List
import logging
import json

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/reorder")
async def reorder_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    page_order: str = Form(...)
):
    """
    Reorder PDF pages
    
    Args:
        file: PDF file to reorder
        page_order: JSON array of page numbers in new order (e.g., "[3,1,2,4]")
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Parse page order
        try:
            page_order_list = json.loads(page_order)
            if not isinstance(page_order_list, list):
                raise ValueError("Page order must be an array")
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Invalid page order format. Must be JSON array"
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
        
        # Validate page order
        page_indices = []
        for page_num in page_order_list:
            if not isinstance(page_num, int):
                raise HTTPException(
                    status_code=400,
                    detail="All page numbers must be integers"
                )
            if page_num < 1 or page_num > total_pages:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid page number: {page_num}"
                )
            # Convert to 0-indexed
            page_indices.append(page_num - 1)
        
        # Reorder PDF
        reordered_pdf = await PDFService.reorder_pdf(content, page_indices)
        
        # Generate unique filename
        output_filename = generate_unique_filename("pdf")
        
        # Upload to Azure Blob Storage
        blob_url = await blob_storage.upload_file(
            reordered_pdf,
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
            "message": "PDF pages reordered successfully",
            "filename": output_filename,
            "download_url": blob_url,
            "file_size": len(reordered_pdf),
            "total_pages": len(page_indices),
            "original_pages": total_pages
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in reorder endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def schedule_file_cleanup(filename: str):
    """Background task to cleanup file after retention period"""
    import asyncio
    await asyncio.sleep(settings.file_retention_minutes * 60)
    await blob_storage.delete_file(filename)
