from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from typing import List, Optional, Dict, Any
from datetime import datetime

from . import models, schemas

class CRUDBase:
    """Base class for CRUD operations."""
    def __init__(self, model):
        self.model = model

    def get(self, db: Session, id: int):
        return db.query(self.model).filter(self.model.id == id).first()

    def get_multi(self, db: Session, *, skip: int = 0, limit: int = 100):
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, *, obj_in: Dict[str, Any]):
        db_obj = self.model(**obj_in)
        db.add(db_obj)
        try:
            db.commit()
            db.refresh(db_obj)
        except SQLAlchemyError as e:
            db.rollback()
            raise e
        return db_obj

    def update(self, db: Session, *, db_obj, obj_in: Dict[str, Any]):
        for field in obj_in:
            if obj_in[field] is not None:
                setattr(db_obj, field, obj_in[field])
        try:
            db.commit()
            db.refresh(db_obj)
        except SQLAlchemyError as e:
            db.rollback()
            raise e
        return db_obj

    def delete(self, db: Session, *, id: int):
        obj = db.query(self.model).get(id)
        if obj:
            db.delete(obj)
            try:
                db.commit()
            except SQLAlchemyError as e:
                db.rollback()
                raise e
        return obj

class CRUDConfiguration(CRUDBase):
    """CRUD operations for configurations."""
    def get_by_name(self, db: Session, *, name: str) -> Optional[models.Configuration]:
        return db.query(models.Configuration).filter(models.Configuration.name == name).first()

    def get_templates(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[models.Configuration]:
        return (
            db.query(models.Configuration)
            .filter(models.Configuration.is_template == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, db: Session, *, obj_in: schemas.ConfigurationCreate) -> models.Configuration:
        return super().create(db, obj_in=obj_in.model_dump())

    def update(
        self, db: Session, *, db_obj: models.Configuration, obj_in: schemas.ConfigurationUpdate
    ) -> models.Configuration:
        return super().update(db, db_obj=db_obj, obj_in=obj_in.model_dump(exclude_unset=True))

class CRUDDocument(CRUDBase):
    """CRUD operations for documents."""
    def create(self, db: Session, *, obj_in: schemas.DocumentCreate) -> models.Document:
        return super().create(db, obj_in=obj_in.model_dump())

    def mark_processed(self, db: Session, *, document_id: int) -> Optional[models.Document]:
        document = self.get(db, document_id)
        if document:
            document.processed = True
            try:
                db.commit()
                db.refresh(document)
            except SQLAlchemyError as e:
                db.rollback()
                raise e
        return document

class CRUDTask(CRUDBase):
    """CRUD operations for tasks."""
    def create(self, db: Session, *, obj_in: schemas.TaskCreate) -> models.Task:
        # Create task
        task_data = {
            "configuration_id": obj_in.configuration_id,
            "status": "pending"
        }
        db_task = super().create(db, obj_in=task_data)

        # Add documents to task
        for doc_id in obj_in.document_ids:
            task_doc = models.TaskDocument(task_id=db_task.id, document_id=doc_id)
            db.add(task_doc)
        
        try:
            db.commit()
            db.refresh(db_task)
        except SQLAlchemyError as e:
            db.rollback()
            raise e
            
        return db_task

    def update_status(
        self, db: Session, *, task_id: int, status: str, error_message: Optional[str] = None
    ) -> Optional[models.Task]:
        task = self.get(db, task_id)
        if task:
            task.status = status
            task.error_message = error_message
            if status == "running" and not task.started_at:
                task.started_at = datetime.utcnow()
            elif status in ["completed", "failed"]:
                task.completed_at = datetime.utcnow()
            try:
                db.commit()
                db.refresh(task)
            except SQLAlchemyError as e:
                db.rollback()
                raise e
        return task

# Create CRUD instances
configuration = CRUDConfiguration(models.Configuration)
document = CRUDDocument(models.Document)
task = CRUDTask(models.Task)