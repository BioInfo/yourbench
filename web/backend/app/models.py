from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Configuration(Base):
    """Pipeline configuration model."""
    __tablename__ = "configurations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, nullable=True)
    yaml_content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_template = Column(Boolean, default=False)
    metadata = Column(JSON, nullable=True)

    # Relationships
    tasks = relationship("Task", back_populates="configuration")

class Document(Base):
    """Source document model."""
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)  # Size in bytes
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    processed = Column(Boolean, default=False)
    metadata = Column(JSON, nullable=True)

    # Relationships
    tasks = relationship("Task", secondary="task_documents")

class Task(Base):
    """Pipeline execution task model."""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    configuration_id = Column(Integer, ForeignKey("configurations.id"))
    status = Column(String, index=True)  # pending, running, completed, failed
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(String, nullable=True)
    result_path = Column(String, nullable=True)
    metrics = Column(JSON, nullable=True)

    # Relationships
    configuration = relationship("Configuration", back_populates="tasks")
    documents = relationship("Document", secondary="task_documents")

class TaskDocument(Base):
    """Association table for tasks and documents."""
    __tablename__ = "task_documents"

    task_id = Column(Integer, ForeignKey("tasks.id"), primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id"), primary_key=True)