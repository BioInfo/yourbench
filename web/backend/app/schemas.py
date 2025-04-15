from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Configuration schemas
class ConfigurationBase(BaseModel):
    """Base configuration schema."""
    name: str = Field(..., description="Configuration name")
    description: Optional[str] = Field(None, description="Configuration description")
    yaml_content: str = Field(..., description="YAML configuration content")
    is_template: bool = Field(False, description="Whether this is a template configuration")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class ConfigurationCreate(ConfigurationBase):
    """Schema for creating a configuration."""
    pass

class ConfigurationUpdate(BaseModel):
    """Schema for updating a configuration."""
    name: Optional[str] = None
    description: Optional[str] = None
    yaml_content: Optional[str] = None
    is_template: Optional[bool] = None
    metadata: Optional[Dict[str, Any]] = None

class ConfigurationResponse(ConfigurationBase):
    """Schema for configuration responses."""
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    """Base document schema."""
    filename: str = Field(..., description="Original filename")
    file_type: str = Field(..., description="File type/extension")
    file_size: int = Field(..., description="File size in bytes")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")

class DocumentCreate(DocumentBase):
    """Schema for creating a document."""
    file_path: str = Field(..., description="Path where the file is stored")

class DocumentResponse(DocumentBase):
    """Schema for document responses."""
    id: int
    file_path: str
    uploaded_at: datetime
    processed: bool

    class Config:
        from_attributes = True

# Task schemas
class TaskBase(BaseModel):
    """Base task schema."""
    configuration_id: int = Field(..., description="ID of the configuration to use")

class TaskCreate(TaskBase):
    """Schema for creating a task."""
    document_ids: List[int] = Field(..., description="IDs of documents to process")

class TaskUpdate(BaseModel):
    """Schema for updating a task."""
    status: Optional[str] = None
    error_message: Optional[str] = None
    result_path: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = None

class TaskResponse(BaseModel):
    """Schema for task responses."""
    id: int
    configuration_id: int
    status: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    error_message: Optional[str]
    result_path: Optional[str]
    metrics: Optional[Dict[str, Any]]
    documents: List[DocumentResponse]

    class Config:
        from_attributes = True

# Error response schema
class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)