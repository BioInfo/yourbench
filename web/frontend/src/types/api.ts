import { Metadata, PipelineMetrics } from './common';

export interface Configuration {
  id: number;
  name: string;
  description?: string;
  yaml_content: string;
  is_template: boolean;
  metadata?: Metadata;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  filename: string;
  file_path: string;
  file_type: string;
  file_size: number;
  uploaded_at: string;
  processed: boolean;
  metadata?: Metadata;
}

export interface Task {
  id: number;
  configuration_id: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  result_path?: string;
  metrics?: PipelineMetrics;
  documents: Document[];
}

export interface ErrorResponse {
  detail: string;
  error_code?: string;
  timestamp: string;
}

// Request types
export interface ConfigurationCreate {
  name: string;
  description?: string;
  yaml_content: string;
  is_template?: boolean;
  metadata?: Metadata;
}

export interface ConfigurationUpdate {
  name?: string;
  description?: string;
  yaml_content?: string;
  is_template?: boolean;
  metadata?: Metadata;
}

export interface TaskCreate {
  configuration_id: number;
  document_ids: number[];
}