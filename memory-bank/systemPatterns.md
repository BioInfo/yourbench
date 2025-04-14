# YourBench System Patterns

## Architecture Overview
YourBench follows a modular pipeline architecture with distinct stages that can be enabled or disabled via configuration. The system is designed to be extensible, allowing for custom implementations of each stage while maintaining a consistent data flow throughout the pipeline.

## Core Components

### 1. Pipeline Handler
- **Purpose**: Orchestrates the execution of pipeline stages in a specified order
- **Implementation**: `yourbench/pipeline/handler.py`
- **Key Responsibilities**:
  - Loads pipeline configuration from YAML/JSON
  - Executes each stage if enabled in the configuration
  - Logs errors to stage-specific log files
  - Collects timing data for performance analysis
  - Generates timing charts for pipeline execution

### 2. Pipeline Stages
Each stage is implemented as a separate module with a standard `run(config)` interface:

#### a. Ingestion
- **Purpose**: Converts source documents to markdown format
- **Implementation**: `yourbench/pipeline/ingestion.py`
- **Pattern**: Uses the MarkItDown library with optional LLM support for advanced conversions

#### b. Upload Ingest to Hub
- **Purpose**: Uploads processed documents to Hugging Face Hub
- **Implementation**: `yourbench/pipeline/upload_ingest_to_hub.py`

#### c. Summarization
- **Purpose**: Generates concise summaries of documents
- **Implementation**: `yourbench/pipeline/summarization.py`
- **Pattern**: Uses LLMs to create document summaries

#### d. Chunking
- **Purpose**: Splits documents into manageable chunks for question generation
- **Implementation**: `yourbench/pipeline/chunking.py`
- **Pattern**: Uses semantic similarity for intelligent chunking

#### e. Single-Shot Question Generation
- **Purpose**: Creates standalone questions from individual chunks
- **Implementation**: `yourbench/pipeline/single_shot_question_generation.py`
- **Pattern**: Uses LLMs with structured prompts to generate QA pairs

#### f. Multi-Hop Question Generation
- **Purpose**: Creates complex questions requiring information from multiple chunks
- **Implementation**: `yourbench/pipeline/multi_hop_question_generation.py`
- **Pattern**: Combines multiple chunks and uses LLMs to generate integrative questions

#### g. LightEval
- **Purpose**: Combines single-shot and multi-hop questions into a unified dataset
- **Implementation**: `yourbench/pipeline/lighteval.py`

### 3. Utility Components

#### a. Dataset Engine
- **Purpose**: Handles dataset loading and saving
- **Implementation**: `yourbench/utils/dataset_engine.py`
- **Pattern**: Abstracts Hugging Face dataset operations

#### b. Inference Engine
- **Purpose**: Manages LLM inference across different providers
- **Implementation**: `yourbench/utils/inference_engine.py`
- **Pattern**: Provides a unified interface for different LLM providers

#### c. Parsing Engine
- **Purpose**: Parses structured responses from LLMs
- **Implementation**: `yourbench/utils/parsing_engine.py`
- **Pattern**: Extracts structured data from LLM outputs

#### d. Prompts
- **Purpose**: Defines system and user prompts for LLM interactions
- **Implementation**: `yourbench/utils/prompts.py`
- **Pattern**: Maintains consistent prompt templates across the pipeline

## Design Patterns

### 1. Configuration-Driven Architecture
- YAML configuration files define pipeline behavior
- Each stage reads its configuration from a common config object
- Environment variables can be referenced in configuration

### 2. Modular Pipeline
- Each stage is independent and can be enabled/disabled
- Stages communicate through standardized dataset formats
- New stages can be added by implementing the standard interface

### 3. Model Abstraction
- Models are defined in configuration and assigned to roles
- Different models can be used for different pipeline stages
- Unified inference interface abstracts provider-specific details

### 4. Error Handling
- Stage-specific log files capture detailed error information
- Pipeline continues execution even if individual stages fail
- Comprehensive error reporting for debugging

### 5. Data Flow
- Documents → Markdown → Summaries → Chunks → Questions → Evaluation Sets
- Each stage transforms the data and passes it to the next stage
- Intermediate results are saved as datasets for inspection and reuse