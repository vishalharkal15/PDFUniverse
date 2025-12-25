import os
import shutil
from datetime import datetime, timedelta
from typing import Optional
import logging
import asyncio

logger = logging.getLogger(__name__)

# Directory for local file storage
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "temp_files")


class LocalFileStorage:
    """Local file storage manager for development/testing"""
    
    def __init__(self):
        self.upload_dir = UPLOAD_DIR
        self._ensure_directory_exists()
        self.file_retention_minutes = 30
    
    def _ensure_directory_exists(self):
        """Create upload directory if it doesn't exist"""
        os.makedirs(self.upload_dir, exist_ok=True)
        logger.info(f"Using local storage directory: {self.upload_dir}")
    
    async def upload_file(
        self, 
        file_content: bytes, 
        blob_name: str,
        content_type: str = "application/pdf"
    ) -> str:
        """
        Save file to local storage
        
        Args:
            file_content: File content as bytes
            blob_name: Name for the file
            content_type: MIME type of the file
            
        Returns:
            File URL (local path for download)
        """
        try:
            file_path = os.path.join(self.upload_dir, blob_name)
            
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            logger.info(f"Saved file locally: {blob_name}")
            # Return a URL that the frontend can use to download
            return f"/api/download/{blob_name}"
            
        except Exception as e:
            logger.error(f"Error saving file locally: {e}")
            raise
    
    async def download_file(self, blob_name: str) -> Optional[bytes]:
        """
        Read file from local storage
        
        Args:
            blob_name: Name of the file to read
            
        Returns:
            File content as bytes or None if not found
        """
        try:
            file_path = os.path.join(self.upload_dir, blob_name)
            
            if not os.path.exists(file_path):
                logger.warning(f"File not found: {blob_name}")
                return None
            
            with open(file_path, 'rb') as f:
                return f.read()
            
        except Exception as e:
            logger.error(f"Error reading file: {e}")
            raise
    
    async def delete_file(self, blob_name: str, delay_seconds: int = 0) -> bool:
        """
        Delete file from local storage
        
        Args:
            blob_name: Name of the file to delete
            delay_seconds: Delay before deleting (for scheduled cleanup)
            
        Returns:
            True if deleted, False if not found
        """
        try:
            # If delay specified, wait before deleting
            if delay_seconds > 0:
                await asyncio.sleep(delay_seconds)
            
            file_path = os.path.join(self.upload_dir, blob_name)
            
            if os.path.exists(file_path):
                os.remove(file_path)
                logger.info(f"Deleted file: {blob_name}")
                return True
            
            logger.warning(f"File not found for deletion: {blob_name}")
            return False
            
        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            raise
    
    async def cleanup_expired_files(self):
        """Delete files older than retention time"""
        try:
            current_time = datetime.now()
            deleted_count = 0
            
            for filename in os.listdir(self.upload_dir):
                file_path = os.path.join(self.upload_dir, filename)
                if os.path.isfile(file_path):
                    file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                    if current_time - file_time > timedelta(minutes=self.file_retention_minutes):
                        os.remove(file_path)
                        deleted_count += 1
            
            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} expired files")
                
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global storage instance
blob_storage = LocalFileStorage()
