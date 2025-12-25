from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/merge")
async def merge_pdfs(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Merge multiple PDF files into one
    
    Upload 2 or more PDF files to merge them into a single document
    """
    try:
        # Validate files
        if len(files) < 2:
            raise HTTPException(
                status_code=400,
                detail="At least 2 PDF files are required for merging"
            )
        
        pdf_contents = []
        total_size = 0
        
        for file in files:
            # Validate PDF file
            if not validate_pdf_file(file.filename):
                raise HTTPException(
                    status_code=400,
                    detail=f"File {file.filename} is not a PDF"
                )
            
            # Read file content
            content = await file.read()
            total_size += len(content)
            
            # Check total size
            if total_size > settings.max_file_size_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"Total file size exceeds {settings.max_file_size_mb}MB limit"
                )
            
            pdf_contents.append(content)
        
        # Merge PDFs
        merged_pdf = await PDFService.merge_pdfs(pdf_contents)
        
        # Generate unique filename
        output_filename = generate_unique_filename("pdf")
        
        # Upload to Azure Blob Storage
        blob_url = await blob_storage.upload_file(
            merged_pdf,
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
            "message": "PDFs merged successfully",
            "filename": output_filename,
            "download_url": blob_url,
            "file_size": len(merged_pdf),
            "pages_count": len(files)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in merge endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


async def schedule_file_cleanup(filename: str):
    """Background task to cleanup file after retention period"""
    import asyncio
    await asyncio.sleep(settings.file_retention_minutes * 60)
    await blob_storage.delete_file(filename)
