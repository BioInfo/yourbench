"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAnalysisMetrics } from "@/lib/api"
import type { AnalysisMetrics } from "@/lib/types"

export default function AnalysisDashboardPage() {
  const [metrics, setMetrics] = useState<AnalysisMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      const result = await getAnalysisMetrics()
      if (result.error) {
        setError(result.error)
      } else if (result.data) {
        setMetrics(result.data)
      }
      setLoading(false)
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg">Loading analysis data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-lg">No analysis data available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Detailed analysis of benchmark results
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/analysis">Back to Analysis</Link>
          </Button>
          <Button variant="outline">Download Report</Button>
          <Button>Share Results</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.coverage.overall)}%</div>
            <Progress value={metrics.coverage.overall} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Content coverage across all documents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Question Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.questionQuality.relevance)}%</div>
            <Progress value={metrics.questionQuality.relevance} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Average quality score of generated questions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(metrics.topicDistribution).length}
            </div>
            <Progress
              value={Object.keys(metrics.topicDistribution).length * 10}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Even distribution across topics
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Difficulty Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(metrics.questionQuality.clarity)}%</div>
            <Progress value={metrics.questionQuality.clarity} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Balance of question difficulty levels
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Question Types</CardTitle>
            <CardDescription>
              Distribution of generated question types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-sm text-muted-foreground">Chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Topic Coverage</CardTitle>
            <CardDescription>
              Coverage analysis by topic area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border rounded-md">
              <p className="text-sm text-muted-foreground">Chart will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Quality Metrics</CardTitle>
            <CardDescription>
              Detailed quality analysis of generated questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Relevance Score</p>
                  <p className="text-sm">{Math.round(metrics.questionQuality.relevance)}%</p>
                </div>
                <Progress value={metrics.questionQuality.relevance} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Clarity Score</p>
                  <p className="text-sm">{Math.round(metrics.questionQuality.clarity)}%</p>
                </div>
                <Progress value={metrics.questionQuality.clarity} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Uniqueness Score</p>
                  <p className="text-sm">{Math.round(metrics.questionQuality.uniqueness)}%</p>
                </div>
                <Progress value={metrics.questionQuality.uniqueness} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Statistics</CardTitle>
            <CardDescription>
              Pipeline performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Total Documents</p>
                  <p className="text-2xl font-bold">{metrics.processingStats.totalDocuments}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Questions</p>
                  <p className="text-2xl font-bold">{metrics.processingStats.totalQuestions}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Processing Time</p>
                  <p className="text-sm">{metrics.processingStats.processingTime}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Average Time/Doc</p>
                  <p className="text-sm">
                    {Math.round(metrics.processingStats.totalDocuments /
                      (parseInt(metrics.processingStats.processingTime) / 60))}s
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Success Rate</p>
                  <p className="text-sm">{metrics.processingStats.successRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}