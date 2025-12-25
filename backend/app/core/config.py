from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Azure Storage Configuration (optional for local development)
    azure_storage_connection_string: Optional[str] = None
    azure_storage_container_name: str = "pdf-files"
    
    # Use local storage for development
    use_local_storage: bool = True
    
    # File Processing Configuration
    max_file_size_mb: int = 50
    file_retention_minutes: int = 30
    
    # CORS Configuration
    cors_origins: str = "http://localhost:5173"
    
    # Application Configuration
    environment: str = "development"
    app_name: str = "PDFUniverse API"
    version: str = "1.0.0"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert comma-separated CORS origins to list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def max_file_size_bytes(self) -> int:
        """Convert MB to bytes"""
        return self.max_file_size_mb * 1024 * 1024
    
    class Config:
        env_file = ".env"
        case_sensitive = False


# Global settings instance
settings = Settings()
