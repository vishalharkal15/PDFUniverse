from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from azure.core.exceptions import ResourceNotFoundError
from datetime import datetime, timedelta
from typing import Optional
import io
import logging

from app.core.config import settings

logger = logging.getLogger(__name__)


class AzureBlobStorage:
    """Azure Blob Storage manager for file operations"""
    
    def __init__(self):
        try:
            self.blob_service_client = BlobServiceClient.from_connection_string(
                settings.azure_storage_connection_string
            )
            self.container_name = settings.azure_storage_container_name
            self._ensure_container_exists()
        except Exception as e:
            logger.error(f"Failed to initialize Azure Blob Storage: {e}")
            raise
    
    def _ensure_container_exists(self):
        """Create container if it doesn't exist"""
        try:
            container_client = self.blob_service_client.get_container_client(
                self.container_name
            )
            if not container_client.exists():
                container_client.create_container()
                logger.info(f"Created container: {self.container_name}")
        except Exception as e:
            logger.error(f"Error ensuring container exists: {e}")
    
    async def upload_file(
        self, 
        file_content: bytes, 
        blob_name: str,
        content_type: str = "application/pdf"
    ) -> str:
        """
        Upload file to Azure Blob Storage
        
        Args:
            file_content: File content as bytes
            blob_name: Name for the blob
            content_type: MIME type of the file
            
        Returns:
            Blob URL
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            
            # Set metadata with expiry time
            expiry_time = datetime.utcnow() + timedelta(
                minutes=settings.file_retention_minutes
            )
            metadata = {
                "expiry_time": expiry_time.isoformat(),
                "uploaded_at": datetime.utcnow().isoformat()
            }
            
            blob_client.upload_blob(
                file_content,
                overwrite=True,
                content_settings={
                    "content_type": content_type
                },
                metadata=metadata
            )
            
            logger.info(f"Uploaded blob: {blob_name}")
            return blob_client.url
            
        except Exception as e:
            logger.error(f"Error uploading file: {e}")
            raise
    
    async def download_file(self, blob_name: str) -> Optional[bytes]:
        """
        Download file from Azure Blob Storage
        
        Args:
            blob_name: Name of the blob to download
            
        Returns:
            File content as bytes or None if not found
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            
            download_stream = blob_client.download_blob()
            return download_stream.readall()
            
        except ResourceNotFoundError:
            logger.warning(f"Blob not found: {blob_name}")
            return None
        except Exception as e:
            logger.error(f"Error downloading file: {e}")
            raise
    
    async def delete_file(self, blob_name: str) -> bool:
        """
        Delete file from Azure Blob Storage
        
        Args:
            blob_name: Name of the blob to delete
            
        Returns:
            True if deleted, False if not found
        """
        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=self.container_name,
                blob=blob_name
            )
            
            blob_client.delete_blob()
            logger.info(f"Deleted blob: {blob_name}")
            return True
            
        except ResourceNotFoundError:
            logger.warning(f"Blob not found for deletion: {blob_name}")
            return False
        except Exception as e:
            logger.error(f"Error deleting file: {e}")
            raise
    
    async def cleanup_expired_files(self):
        """Delete files that have exceeded retention time"""
        try:
            container_client = self.blob_service_client.get_container_client(
                self.container_name
            )
            
            current_time = datetime.utcnow()
            deleted_count = 0
            
            blobs = container_client.list_blobs(include=['metadata'])
            
            for blob in blobs:
                if blob.metadata and 'expiry_time' in blob.metadata:
                    expiry_time = datetime.fromisoformat(
                        blob.metadata['expiry_time']
                    )
                    
                    if current_time > expiry_time:
                        await self.delete_file(blob.name)
                        deleted_count += 1
            
            if deleted_count > 0:
                logger.info(f"Cleaned up {deleted_count} expired files")
                
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global storage instance
blob_storage = AzureBlobStorage()
