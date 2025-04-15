"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { YAMLEditor } from "@/components/pipeline/yaml-editor"
import { useStore } from "@/lib/store"
import { toast } from "sonner"
import yaml from "yaml"
import { PipelineConfig } from "@/lib/types"

interface NewPipelineContainerProps {
  defaultConfig: string
}

export function NewPipelineContainer({ defaultConfig }: NewPipelineContainerProps) {
  const router = useRouter()
  const { startPipeline } = useStore()
  const [config, setConfig] = useState(defaultConfig)

  const handleSaveAndRun = async () => {
    try {
      // Parse YAML to validate
      const parsedConfig = yaml.parse(config) as PipelineConfig

      // Start pipeline
      await startPipeline(parsedConfig)
      
      toast.success("Pipeline Started", {
        description: "The pipeline has been started successfully",
      })

      // Navigate to pipeline page to monitor progress
      router.push("/pipeline")
    } catch (error) {
      toast.error("Failed to Start Pipeline", {
        description: error instanceof Error ? error.message : "Invalid configuration",
      })
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">New Pipeline</h1>
          <p className="text-muted-foreground">
            Create a new benchmark generation pipeline
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/pipeline">Back to Pipeline</Link>
          </Button>
          <Button onClick={handleSaveAndRun}>
            Save & Run
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>
              Configure your pipeline settings in YAML format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <YAMLEditor 
              defaultValue={config} 
              onChange={(value) => setConfig(value || "")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Settings</CardTitle>
            <CardDescription>
              Common pipeline configuration options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Input Directory</h3>
                <p className="text-sm text-muted-foreground">
                  Select source documents directory
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Model Selection</h3>
                <p className="text-sm text-muted-foreground">
                  Choose models for pipeline stages
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Output Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Configure output and export options
                </p>
              </div>

              <Button 
                className="w-full"
                onClick={() => {
                  toast.info("Coming Soon", {
                    description: "Quick settings will be available soon",
                  })
                }}
              >
                Apply Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}