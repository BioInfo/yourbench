# YourBench Project Brief

## Project Overview
YourBench is an open-source framework for generating domain-specific benchmarks in a zero-shot manner. It aims to keep large language models (LLMs) on their toes by creating fresh evaluation tasks from real-world source documents, even as new data sources, domains, and knowledge demands evolve.

## Core Objectives
1. Create dynamic, up-to-date question-answer pairs from real-world source documents
2. Generate benchmarks that test LLMs on zero-shot tasks to guard against memorized knowledge
3. Provide a scalable and structured pipeline for handling ingestion, summarization, and question generation
4. Support extensibility through modular pipeline stages and easy plugin mechanisms

## Key Features
- **Dynamic Benchmark Generation**: Produce diverse, up-to-date questions from various source documents (PDF, Word, HTML, multimedia)
- **Scalable & Structured**: Handle ingestion, summarization, and multi-hop chunking for large or specialized datasets
- **Zero-Shot Focus**: Create fresh tasks that guard against memorized knowledge
- **Extensible**: Modular pipeline stages with easy plugin mechanisms for custom models or domain constraints

## Technical Requirements
- Support for multiple document formats (PDF, HTML, Word, text)
- Configurable pipeline stages via YAML configuration
- Multi-model ensemble support for different pipeline stages
- Deduplication and quality filtering of generated questions
- Extensive logging and analysis capabilities
- Optional integration with Hugging Face Hub for dataset storage

## Success Criteria
1. Successfully generate meaningful question-answer pairs from various document types
2. Support both single-shot (simple) and multi-hop (complex) question generation
3. Provide configurable pipeline stages that can be enabled/disabled as needed
4. Allow for different models to be used at different stages of the pipeline
5. Generate benchmarks that effectively test LLM capabilities in a zero-shot manner