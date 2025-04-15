import asyncio
import yaml
from typing import List, Dict, Any
from pathlib import Path
from datetime import datetime

from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, models
from .. import schemas

async def update_task_status(
    task_id: int,
    status: str,
    error_message: str = None,
    metrics: Dict[str, Any] = None
) -> None:
    """Update task status in database."""
    db = SessionLocal()
    try:
        task = crud.task.get(db, task_id)
        if task:
            # Update status
            task = crud.task.update_status(db, task_id=task_id, status=status, error_message=error_message)
            
            # Update metrics if provided
            if metrics and status == "completed":
                task.metrics = metrics
                db.commit()
    finally:
        db.close()

async def execute_pipeline_task(
    task_id: int,
    configuration: models.Configuration,
    documents: List[models.Document]
) -> None:
    """Execute YourBench pipeline for a given task."""
    try:
        # Update task status to running
        await update_task_status(task_id, "running")

        # Create results directory
        results_dir = Path(f"results/task_{task_id}")
        results_dir.mkdir(parents=True, exist_ok=True)

        # Parse configuration YAML
        config = yaml.safe_load(configuration.yaml_content)

        # Collect document paths
        doc_paths = [doc.file_path for doc in documents]

        # Update configuration with document paths
        config["pipeline"]["ingestion"]["source_documents"] = doc_paths
        config["pipeline"]["ingestion"]["output_dir"] = str(results_dir / "processed")

        # Configure result paths
        config["pipeline"]["lighteval"]["output_dir"] = str(results_dir / "evaluation")

        # Write updated configuration
        config_path = results_dir / "config.yaml"
        with open(config_path, "w") as f:
            yaml.dump(config, f)

        # Import YourBench pipeline handler here to avoid circular imports
        from yourbench.pipeline.handler import PipelineHandler

        # Initialize pipeline
        pipeline = PipelineHandler(config_path=str(config_path))

        # Run pipeline with progress tracking
        pipeline_metrics = {}
        stage_timings = {}

        try:
            # Execute each pipeline stage
            for stage in pipeline.get_enabled_stages():
                stage_start = datetime.utcnow()
                
                # Run stage
                stage_result = await pipeline.run_stage(stage)
                
                # Record timing
                stage_end = datetime.utcnow()
                stage_timings[stage] = (stage_end - stage_start).total_seconds()

                # Collect metrics
                if stage_result and isinstance(stage_result, dict):
                    pipeline_metrics[stage] = stage_result

            # Mark task as completed
            metrics = {
                "timings": stage_timings,
                "pipeline_metrics": pipeline_metrics,
                "results_dir": str(results_dir)
            }
            await update_task_status(task_id, "completed", metrics=metrics)

        except Exception as e:
            # Handle pipeline execution errors
            error_message = f"Pipeline execution failed: {str(e)}"
            await update_task_status(task_id, "failed", error_message=error_message)
            raise

    except Exception as e:
        # Handle any other errors
        error_message = f"Task execution failed: {str(e)}"
        await update_task_status(task_id, "failed", error_message=error_message)
        raise

def handle_pipeline_progress(stage: str, progress: float, message: str) -> None:
    """Handle progress updates from pipeline."""
    # TODO: Implement WebSocket updates for real-time progress reporting
    pass

def handle_pipeline_error(stage: str, error: Exception) -> None:
    """Handle pipeline errors."""
    # TODO: Implement error handling and reporting
    pass