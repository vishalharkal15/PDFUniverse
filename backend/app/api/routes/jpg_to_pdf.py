from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from typing import List
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.tif'}


def validate_image_file(filename: str) -> bool:
    """Validate image file extension"""
    if not filename:
        return False
    ext = '.' + filename.lower().split('.')[-1] if '.' in filename else ''
    return ext in ALLOWED_IMAGE_EXTENSIONS


@router.post("/jpg-to-pdf")
async def jpg_to_pdf(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...)
):
    """
    Convert images to PDF
    
    Upload one or more images (JPG, PNG, etc.) to convert them to a PDF document.
    Each image will be placed on its own page.
    """
    try:
        # Validate files
        if len(files) < 1:
            raise HTTPException(
                status_code=400,
                detail="At least 1 image file is required"
            )
        
        image_contents = []
        total_size = 0
        
        for file in files:
            # Validate image file
            if not validate_image_file(file.filename):
                raise HTTPException(
                    status_code=400,
                    detail=f"File {file.filename} is not a supported image format. Supported: JPG, PNG, GIF, BMP, WebP, TIFF"
                )
            
            # Read file content
            content = await file.read()
            total_size += len(content)
            
            # Check total size
            if total_size > settings.max_file_size_bytes:
                raise HTTPException(
                    status_code=413,
                    detail=f"Total file size exceeds maximum allowed ({settings.max_file_size}MB)"
                )
            
            image_contents.append(content)
        
        # Convert images to PDF
        pdf_content = await PDFService.images_to_pdf(image_contents)
        
        # Generate filename and save
        output_filename = generate_unique_filename("pdf")
        download_url = await blob_storage.upload_file(
            pdf_content,
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
            "message": f"Converted {len(files)} image(s) to PDF successfully",
            "download_url": download_url,
            "filename": output_filename,
            "pages": len(files)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in JPG to PDF endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to convert images to PDF: {str(e)}"
        )
