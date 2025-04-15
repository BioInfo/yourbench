from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import shutil
from datetime import datetime
from pathlib import Path

from ..database import get_db
from .. import crud, schemas

router = APIRouter(
    prefix="/api/v1/documents",
    tags=["documents"]
)

# Configure upload directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def get_file_type(filename: str) -> str:
    """Get file type from filename."""
    return Path(filename).suffix.lower()[1:]  # Remove the dot from extension

def save_upload_file(upload_file: UploadFile) -> Path:
    """Save an uploaded file and return its path."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"{timestamp}_{upload_file.filename}"
    file_path = UPLOAD_DIR / safe_filename
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

@router.post("/", response_model=schemas.DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a new document."""
    # Validate file type
    file_type = get_file_type(file.filename)
    allowed_types = {"pdf", "html", "txt", "doc", "docx"}
    if file_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type not supported. Allowed types: {', '.join(allowed_types)}"
        )

    try:
        # Save file
        file_path = save_upload_file(file)
        file_size = os.path.getsize(file_path)

        # Create document record
        document_in = schemas.DocumentCreate(
            filename=file.filename,
            file_path=str(file_path),
            file_type=file_type,
            file_size=file_size
        )
        document = crud.document.create(db, obj_in=document_in)
        return document

    except Exception as e:
        # Clean up file if database operation fails
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading document: {str(e)}"
        )

@router.get("/", response_model=List[schemas.DocumentResponse])
async def list_documents(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    processed: bool = None,
    db: Session = Depends(get_db)
):
    """List uploaded documents with optional filtering."""
    query = db.query(crud.document.model)
    if processed is not None:
        query = query.filter(crud.document.model.processed == processed)
    return query.offset(skip).limit(limit).all()

@router.get("/{document_id}", response_model=schemas.DocumentResponse)
async def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Get document details by ID."""
    document = crud.document.get(db, document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    return document

@router.get("/{document_id}/download")
async def download_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Download a document by ID."""
    document = crud.document.get(db, document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    file_path = Path(document.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Document file not found"
        )

    return FileResponse(
        path=file_path,
        filename=document.filename,
        media_type=f"application/{document.file_type}"
    )

@router.delete("/{document_id}", response_model=schemas.DocumentResponse)
async def delete_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """Delete a document and its file."""
    document = crud.document.get(db, document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )

    # Delete file
    file_path = Path(document.file_path)
    if file_path.exists():
        file_path.unlink()

    # Delete database record
    return crud.document.delete(db, id=document_id)