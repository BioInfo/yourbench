# YourBench Active Context

## Current Focus
The YourBench project is currently in alpha stage, with a functional pipeline that supports document ingestion, summarization, chunking, and question generation. The focus is on stabilizing the core pipeline, improving question quality, and enhancing the user experience.

## Recent Changes
- Implemented the core pipeline stages (ingestion, summarization, chunking, question generation)
- Created a configuration-driven architecture for flexible pipeline customization
- Developed a unified inference engine for working with different LLM providers
- Established structured prompts for single-shot and multi-hop question generation
- Added support for various document formats through the MarkItDown library
- Implemented dataset management for storing intermediate and final results

## Active Decisions

### 1. Pipeline Architecture
- **Decision**: Implement a modular pipeline with configurable stages
- **Rationale**: Allows users to enable/disable stages as needed and customize the pipeline for their specific use cases
- **Status**: Implemented and working as expected

### 2. Model Selection
- **Decision**: Allow different models for different pipeline stages
- **Rationale**: Different stages (e.g., ingestion vs. question generation) may benefit from specialized models
- **Status**: Implemented through the model_roles configuration

### 3. Question Generation Approach
- **Decision**: Support both single-shot (simple) and multi-hop (complex) question generation
- **Rationale**: Provides a range of question complexity for comprehensive evaluation
- **Status**: Both approaches implemented, with ongoing refinement of prompts

### 4. Chunking Strategy
- **Decision**: Use semantic similarity for intelligent document chunking
- **Rationale**: Creates more meaningful chunks compared to simple length-based splitting
- **Status**: Implemented, with parameters configurable through YAML

### 5. Dataset Management
- **Decision**: Use Hugging Face Datasets for storing intermediate and final results
- **Rationale**: Provides a standardized format with good tooling support
- **Status**: Implemented with options for local storage or Hub upload

## Current Considerations

### 1. Question Quality
- How to ensure generated questions are meaningful and challenging
- Balancing question difficulty based on user preferences
- Improving the diversity of question types

### 2. Performance Optimization
- Optimizing LLM usage to reduce costs
- Improving pipeline efficiency for large document sets
- Implementing parallel processing where possible

### 3. User Experience
- Simplifying configuration for new users
- Providing better feedback during pipeline execution
- Adding visualization tools for analyzing generated questions

### 4. Evaluation Metrics
- Developing metrics to evaluate the quality of generated questions
- Creating tools to compare model performance on generated benchmarks
- Implementing deduplication to remove similar questions

## Next Steps
1. Implement deduplication for single-shot and multi-hop questions
2. Enhance error handling and recovery mechanisms
3. Improve documentation and examples
4. Add more analysis tools for evaluating generated questions
5. Develop a web interface for easier interaction with the pipeline (see webInterfacePlan.md)
6. Expand testing coverage to ensure reliability

## Web Interface Development
A comprehensive plan has been created for developing a web-based interface for YourBench. This interface will allow users to:

1. Configure and run the YourBench pipeline through an intuitive web UI
2. Upload source documents through a drag-and-drop interface
3. Monitor pipeline execution in real-time
4. Retrieve and visualize generated benchmark datasets
5. Explore results with interactive visualizations

The development will follow a phased approach over 14 weeks, focusing on:
- Core backend services (REST API, Pipeline Runner)
- Frontend application (Configuration Builder, Document Uploader)
- Results visualization components
- Deployment options (local and cloud)

See `webInterfacePlan.md` for the complete development plan.