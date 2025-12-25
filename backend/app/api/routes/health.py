from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring
    
    Returns API status and current timestamp
    """
    return {
        "status": "healthy",
        "service": "iHitPDF API",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0"
    }
