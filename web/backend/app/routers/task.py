from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from .. import crud, schemas
from ..workers.pipeline import execute_pipeline_task

router = APIRouter(
    prefix="/api/v1/tasks",
    tags=["tasks"]
)

@router.post("/", response_model=schemas.TaskResponse)
async def create_task(
    task_create: schemas.TaskCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create and start a new pipeline task."""
    # Validate configuration exists
    configuration = crud.configuration.get(db, task_create.configuration_id)
    if not configuration:
        raise HTTPException(
            status_code=404,
            detail="Configuration not found"
        )

    # Validate all documents exist
    documents = []
    for doc_id in task_create.document_ids:
        document = crud.document.get(db, doc_id)
        if not document:
            raise HTTPException(
                status_code=404,
                detail=f"Document {doc_id} not found"
            )
        documents.append(document)

    # Create task
    task = crud.task.create(db, obj_in=task_create)

    # Start pipeline execution in background
    background_tasks.add_task(
        execute_pipeline_task,
        task_id=task.id,
        configuration=configuration,
        documents=documents
    )

    return task

@router.get("/", response_model=List[schemas.TaskResponse])
async def list_tasks(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: str = None,
    db: Session = Depends(get_db)
):
    """List tasks with optional status filtering."""
    query = db.query(crud.task.model)
    if status:
        valid_statuses = {"pending", "running", "completed", "failed"}
        if status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
            )
        query = query.filter(crud.task.model.status == status)
    return query.offset(skip).limit(limit).all()

@router.get("/{task_id}", response_model=schemas.TaskResponse)
async def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """Get task details by ID."""
    task = crud.task.get(db, task_id)
    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    return task

@router.delete("/{task_id}", response_model=schemas.TaskResponse)
async def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """Delete a task and its results."""
    task = crud.task.get(db, task_id)
    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )
    
    if task.status == "running":
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a running task"
        )

    # TODO: Delete result files if they exist
    # This will be implemented when the pipeline execution is set up

    return crud.task.delete(db, id=task_id)

@router.post("/{task_id}/cancel")
async def cancel_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    """Cancel a running task."""
    task = crud.task.get(db, task_id)
    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    if task.status != "running":
        raise HTTPException(
            status_code=400,
            detail="Can only cancel running tasks"
        )

    # TODO: Implement task cancellation logic
    # This will be implemented when the pipeline execution is set up
    
    task = crud.task.update_status(
        db,
        task_id=task_id,
        status="failed",
        error_message="Task cancelled by user"
    )
    
    return {"status": "cancelled"}