import uuid
import os
from typing import List
from datetime import datetime


def generate_unique_filename(extension: str = "pdf") -> str:
    """
    Generate a unique filename with timestamp and UUID
    
    Args:
        extension: File extension without dot
        
    Returns:
        Unique filename
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    unique_id = uuid.uuid4().hex[:8]
    return f"{timestamp}_{unique_id}.{extension}"


def validate_file_size(file_size: int, max_size: int) -> bool:
    """
    Validate file size against maximum allowed
    
    Args:
        file_size: Size of file in bytes
        max_size: Maximum allowed size in bytes
        
    Returns:
        True if valid, False otherwise
    """
    return file_size <= max_size


def validate_pdf_file(filename: str) -> bool:
    """
    Validate if file has PDF extension
    
    Args:
        filename: Name of the file
        
    Returns:
        True if PDF, False otherwise
    """
    return filename.lower().endswith('.pdf')


def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human-readable format
    
    Args:
        size_bytes: Size in bytes
        
    Returns:
        Formatted string (e.g., "1.5 MB")
    """
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"


def parse_page_ranges(page_ranges: str, total_pages: int) -> List[int]:
    """
    Parse page range string into list of page numbers
    
    Args:
        page_ranges: String like "1-3,5,7-9"
        total_pages: Total number of pages in PDF
        
    Returns:
        List of page numbers (0-indexed)
    """
    pages = set()
    
    for part in page_ranges.split(','):
        part = part.strip()
        
        if '-' in part:
            # Range like "1-3"
            start, end = part.split('-')
            start = int(start.strip())
            end = int(end.strip())
            
            # Validate range
            if start < 1 or end > total_pages or start > end:
                raise ValueError(f"Invalid page range: {part}")
            
            # Add pages (convert to 0-indexed)
            pages.update(range(start - 1, end))
        else:
            # Single page
            page = int(part)
            if page < 1 or page > total_pages:
                raise ValueError(f"Invalid page number: {page}")
            pages.add(page - 1)
    
    return sorted(list(pages))
