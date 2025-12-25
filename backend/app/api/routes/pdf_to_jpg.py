from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/pdf-to-jpg")
async def pdf_to_jpg(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    format: str = Form(default="jpeg"),
    dpi: int = Form(default=200)
):
    """
    Convert PDF pages to images (JPG/PNG)
    
    Upload a PDF file to convert all pages to images.
    Returns a ZIP file containing all images.
    """
    try:
        # Validate PDF file
        if not validate_pdf_file(file.filename):
            raise HTTPException(
                status_code=400,
                detail="File must be a PDF"
            )
        
        # Validate format
        if format.lower() not in ["jpeg", "jpg", "png"]:
            raise HTTPException(
                status_code=400,
                detail="Format must be 'jpeg' or 'png'"
            )
        
        # Validate DPI
        if dpi < 72 or dpi > 600:
            raise HTTPException(
                status_code=400,
                detail="DPI must be between 72 and 600"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size
        if len(content) > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File size exceeds maximum allowed ({settings.max_file_size}MB)"
            )
        
        # Convert format name
        img_format = "png" if format.lower() == "png" else "jpeg"
        
        # Convert PDF to images
        zip_content = await PDFService.pdf_to_images(content, img_format, dpi)
        
        # Generate filename and save
        output_filename = generate_unique_filename("zip")
        download_url = await blob_storage.upload_file(
            zip_content,
            output_filename,
            content_type="application/zip"
        )
        
        # Schedule cleanup
        background_tasks.add_task(
            blob_storage.delete_file,
            output_filename,
            delay_seconds=settings.file_retention_minutes * 60
        )
        
        return {
            "success": True,
            "message": "PDF converted to images successfully",
            "download_url": download_url,
            "filename": output_filename,
            "format": img_format,
            "dpi": dpi
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in PDF to JPG endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to convert PDF to images: {str(e)}"
        )
