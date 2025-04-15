from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from .. import crud, schemas

router = APIRouter(
    prefix="/api/v1/configurations",
    tags=["configurations"]
)

@router.get("/", response_model=List[schemas.ConfigurationResponse])
async def list_configurations(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    templates_only: bool = False,
    db: Session = Depends(get_db)
):
    """List configurations with optional filtering for templates."""
    if templates_only:
        return crud.configuration.get_templates(db, skip=skip, limit=limit)
    return crud.configuration.get_multi(db, skip=skip, limit=limit)

@router.post("/", response_model=schemas.ConfigurationResponse)
async def create_configuration(
    configuration: schemas.ConfigurationCreate,
    db: Session = Depends(get_db)
):
    """Create a new configuration."""
    # Check if configuration with same name exists
    if crud.configuration.get_by_name(db, name=configuration.name):
        raise HTTPException(
            status_code=400,
            detail="Configuration with this name already exists"
        )
    return crud.configuration.create(db, obj_in=configuration)

@router.get("/{configuration_id}", response_model=schemas.ConfigurationResponse)
async def get_configuration(
    configuration_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific configuration by ID."""
    configuration = crud.configuration.get(db, configuration_id)
    if not configuration:
        raise HTTPException(
            status_code=404,
            detail="Configuration not found"
        )
    return configuration

@router.put("/{configuration_id}", response_model=schemas.ConfigurationResponse)
async def update_configuration(
    configuration_id: int,
    configuration_update: schemas.ConfigurationUpdate,
    db: Session = Depends(get_db)
):
    """Update a configuration."""
    configuration = crud.configuration.get(db, configuration_id)
    if not configuration:
        raise HTTPException(
            status_code=404,
            detail="Configuration not found"
        )
    
    # Check name conflict if name is being updated
    if configuration_update.name and configuration_update.name != configuration.name:
        existing = crud.configuration.get_by_name(db, name=configuration_update.name)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Configuration with this name already exists"
            )
    
    return crud.configuration.update(db, db_obj=configuration, obj_in=configuration_update)

@router.delete("/{configuration_id}", response_model=schemas.ConfigurationResponse)
async def delete_configuration(
    configuration_id: int,
    db: Session = Depends(get_db)
):
    """Delete a configuration."""
    configuration = crud.configuration.get(db, configuration_id)
    if not configuration:
        raise HTTPException(
            status_code=404,
            detail="Configuration not found"
        )
    return crud.configuration.delete(db, id=configuration_id)