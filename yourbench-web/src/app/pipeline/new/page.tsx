import { NewPipelineContainer } from "@/components/pipeline/new-pipeline-container"

const defaultConfig = `# YourBench Pipeline Configuration

# === HUGGINGFACE SETTINGS CONFIGURATION ===
hf_configuration:
  token: $HF_TOKEN
  hf_organization: $HF_ORGANIZATION
  private: false
  hf_dataset_name: yourbench_test_dataset
  concat_if_exist: false

# === MODEL CONFIGURATION ===
model_list:
  - model_name: gpt-3.5-turbo
    provider: openai
    api_key: $OPENAI_API_KEY
    max_concurrent_requests: 32

model_roles:
  ingestion:
    - gpt-3.5-turbo
  summarization:
    - gpt-3.5-turbo
  chunking:
    - intfloat/multilingual-e5-large-instruct
  single_shot_question_generation:
    - gpt-3.5-turbo
  multi_hop_question_generation:
    - gpt-3.5-turbo

pipeline:
  # Document ingestion
  ingestion:
    run: true
    source_documents_dir: example/data/raw
    output_dir: example/data/processed

  # Upload to Hugging Face Hub
  upload_ingest_to_hub:
    run: true
    source_documents_dir: example/data/processed

  # Document summarization
  summarization:
    run: true
  
  # Text chunking
  chunking:
    run: true
    chunking_configuration:
      l_min_tokens: 64
      l_max_tokens: 128
      tau_threshold: 0.8
      h_min: 2
      h_max: 5
      num_multihops_factor: 2
  
  # Single-shot question generation
  single_shot_question_generation:
    run: true
    additional_instructions: "Generate questions to test a curious adult"
    chunk_sampling:
      mode: "count"
      value: 5
      random_seed: 123
  
  # Multi-hop question generation
  multi_hop_question_generation:
    run: true
    additional_instructions: "Generate questions to test a curious adult"
    chunk_sampling:
      mode: "percentage"
      value: 0.3
      random_seed: 42

  # Combine questions into dataset
  lighteval:
    run: true`

export default function NewPipelinePage() {
  return <NewPipelineContainer defaultConfig={defaultConfig} />
}