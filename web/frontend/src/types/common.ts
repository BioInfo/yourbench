export interface Metadata {
  description?: string;
  tags?: string[];
  category?: string;
  author?: string;
  createdBy?: string;
  version?: string;
  [key: string]: string | string[] | undefined;
}

export interface PipelineMetrics {
  timings: {
    [stage: string]: number;
  };
  pipeline_metrics: {
    [stage: string]: {
      processed_documents?: number;
      generated_questions?: number;
      chunks_processed?: number;
      execution_time?: number;
      memory_usage?: number;
      [key: string]: number | undefined;
    };
  };
  results_dir: string;
}