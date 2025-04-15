import React, { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Form from '@radix-ui/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { cn } from '../../lib/utils';
import { queryKeys } from '../../lib/query-keys';
import { ConfigurationCreate } from '../../types/api';
import { useToast } from '../../hooks/use-toast';

interface ConfigurationBuilderProps {
  onSuccess?: () => void;
  initialData?: ConfigurationCreate;
}

export const ConfigurationBuilder: React.FC<ConfigurationBuilderProps> = ({
  onSuccess,
  initialData
}) => {
  const [activeTab, setActiveTab] = useState('form');
  const [formData, setFormData] = useState<ConfigurationCreate>(initialData || {
    name: '',
    yaml_content: `# YourBench Pipeline Configuration

pipeline:
  ingestion:
    run: true
    source_documents_dir: example/data/raw
    output_dir: example/data/processed

  summarization:
    run: true
    max_length: 500

  chunking:
    run: true
    chunk_size: 1000
    chunk_overlap: 200

  single_shot_question_generation:
    run: true
    questions_per_chunk: 3

  multi_hop_question_generation:
    run: false
    questions_per_combination: 2
    max_hops: 2
`,
    is_template: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: ConfigurationCreate) => apiClient.createConfiguration(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.configurations.all });
      toast({
        title: "Configuration Created",
        description: "Your configuration has been saved successfully.",
        variant: "success",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Configuration",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Tabs.List className="flex border-b mb-4">
          <Tabs.Trigger
            value="form"
            className={cn(
              'px-4 py-2 -mb-px text-sm font-medium',
              'border-b-2 border-transparent',
              'hover:border-foreground/30 transition-colors',
              activeTab === 'form' && 'border-primary text-primary'
            )}
          >
            Form
          </Tabs.Trigger>
          <Tabs.Trigger
            value="yaml"
            className={cn(
              'px-4 py-2 -mb-px text-sm font-medium',
              'border-b-2 border-transparent',
              'hover:border-foreground/30 transition-colors',
              activeTab === 'yaml' && 'border-primary text-primary'
            )}
          >
            YAML Editor
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="form" className="outline-none">
          <Form.Root onSubmit={handleSubmit} className="space-y-4">
            <Form.Field name="name">
              <div className="space-y-2">
                <Form.Label className="text-sm font-medium">
                  Configuration Name
                </Form.Label>
                <Form.Control asChild>
                  <input
                    type="text"
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2',
                      'text-sm ring-offset-background file:border-0 file:bg-transparent',
                      'file:text-sm file:font-medium placeholder:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </Form.Control>
                <Form.Message className="text-sm text-destructive" match="valueMissing">
                  Please enter a configuration name
                </Form.Message>
              </div>
            </Form.Field>

            <Form.Field name="description">
              <div className="space-y-2">
                <Form.Label className="text-sm font-medium">
                  Description (Optional)
                </Form.Label>
                <Form.Control asChild>
                  <textarea
                    className={cn(
                      'flex w-full rounded-md border border-input bg-transparent px-3 py-2',
                      'text-sm ring-offset-background placeholder:text-muted-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y'
                    )}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="is_template">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={formData.is_template}
                    onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  Save as template
                </Form.Label>
              </div>
            </Form.Field>

            <Form.Submit asChild>
              <button
                className={cn(
                  'inline-flex items-center justify-center rounded-md text-sm font-medium',
                  'bg-primary text-primary-foreground h-10 px-4 py-2',
                  'hover:bg-primary/90 focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'disabled:pointer-events-none disabled:opacity-50'
                )}
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Configuration'}
              </button>
            </Form.Submit>
          </Form.Root>
        </Tabs.Content>

        <Tabs.Content value="yaml" className="outline-none">
          <div className="space-y-4">
            <div className="h-[600px] border rounded-md overflow-hidden">
              <Editor
                defaultLanguage="yaml"
                value={formData.yaml_content}
                onChange={(value) => setFormData({ ...formData, yaml_content: value || '' })}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  renderWhitespace: 'selection',
                }}
              />
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};