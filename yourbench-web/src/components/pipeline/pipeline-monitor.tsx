"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PipelineMonitor() {
  const { pipelineStatus, getPipelineStatus, loadingPipelineStatus } = useStore()

  // Poll for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      getPipelineStatus()
    }, 1000) // Poll every second

    return () => clearInterval(interval)
  }, [getPipelineStatus])

  if (!pipelineStatus && !loadingPipelineStatus) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Status</CardTitle>
        <CardDescription>
          Current pipeline execution status and progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {loadingPipelineStatus ? "Checking status..." : pipelineStatus?.status || "Not running"}
              </p>
            </div>
            {pipelineStatus?.status === "running" && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border animate-spin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              </div>
            )}
          </div>

          {typeof pipelineStatus?.progress === "number" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <p>Progress</p>
                <p>{pipelineStatus.progress}%</p>
              </div>
              <Progress value={pipelineStatus.progress} className="h-2" />
            </div>
          )}

          {/* Log Output */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Log Output</p>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="font-mono text-sm">
                {!pipelineStatus?.logs || pipelineStatus.logs.length === 0 ? (
                  <p className="text-muted-foreground">No logs available</p>
                ) : (
                  pipelineStatus.logs.map((log: string, index: number) => (
                    <div key={index} className="whitespace-pre-wrap">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {pipelineStatus?.results && (
            <div className="space-y-2 border-t pt-4 mt-4">
              <p className="text-sm font-medium">Results</p>
              <div className="grid grid-cols-2 gap-4">
                {pipelineStatus.results.questionCount !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="text-2xl font-bold">{pipelineStatus.results.questionCount}</p>
                  </div>
                )}
                {pipelineStatus.results.coverage !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Coverage</p>
                    <p className="text-2xl font-bold">{pipelineStatus.results.coverage}%</p>
                  </div>
                )}
                {pipelineStatus.results.processingTime && (
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="text-lg font-medium">{pipelineStatus.results.processingTime}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}