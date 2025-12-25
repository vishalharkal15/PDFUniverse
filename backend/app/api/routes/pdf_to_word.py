from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
import logging

from app.services.pdf_service import PDFService
from app.storage.local_storage import blob_storage
from app.utils.helpers import generate_unique_filename, validate_pdf_file
from app.core.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/pdf-to-word")
async def pdf_to_word(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Convert PDF to Word document (DOCX)
    
    Upload a PDF file to convert it to an editable Word document
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
                detail=f"File size exceeds maximum allowed ({settings.max_file_size}MB)"
            )
        
        # Convert PDF to Word
        docx_content = await PDFService.pdf_to_word(content)
        
        # Generate filename and save
        output_filename = generate_unique_filename("docx")
        download_url = await blob_storage.upload_file(
            docx_content,
            output_filename,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
        
        # Schedule cleanup
        background_tasks.add_task(
            blob_storage.delete_file,
            output_filename,
            delay_seconds=settings.file_retention_minutes * 60
        )
        
        return {
            "success": True,
            "message": "PDF converted to Word successfully",
            "download_url": download_url,
            "filename": output_filename,
            "original_size": len(content),
            "converted_size": len(docx_content)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in PDF to Word endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to convert PDF to Word: {str(e)}"
        )
