import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"

const execAsync = promisify(exec)

interface AnalysisMetrics {
  coverage: {
    overall: number
    byDocument: Record<string, number>
  }
  questionQuality: {
    relevance: number
    clarity: number
    uniqueness: number
  }
  questionTypes: {
    singleHop: number
    multiHop: number
    factual: number
    analytical: number
  }
  topicDistribution: Record<string, number>
  processingStats: {
    totalDocuments: number
    totalQuestions: number
    processingTime: string
    successRate: number
  }
}

export async function GET() {
  try {
    const organization = process.env.HF_ORGANIZATION
    if (!organization) {
      throw new Error("HF_ORGANIZATION environment variable not set")
    }

    // Run pipeline with config to get metrics
    console.log("Running pipeline for analysis")
    const configPath = path.join(process.cwd(), "..", "configs", "pipeline.yaml")
    const { stdout, stderr } = await execAsync(
      `yourbench run --config ${configPath}`,
      { cwd: path.join(process.cwd(), "..") }
    )
    console.log("Command output:", stdout)
    if (stderr) {
      console.error("Command stderr:", stderr)
    }

    // Parse metrics from output
    const metrics = parseMetrics(stdout)
    console.log("Parsed metrics:", metrics)
    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching analysis:", error)
    if (error instanceof Error) {
      console.error("Error details:", error.message)
      const cmdError = error as { stdout?: string; stderr?: string }
      if (cmdError.stdout) {
        console.log("Command stdout:", cmdError.stdout)
      }
      if (cmdError.stderr) {
        console.error("Command stderr:", cmdError.stderr)
      }
    }
    return NextResponse.json(
      { error: "Failed to fetch analysis data" },
      { status: 500 }
    )
  }
}

function parseMetrics(output: string): AnalysisMetrics {
  try {
    // Try to parse as JSON first
    const jsonMetrics = JSON.parse(output)
    console.log("Parsed JSON metrics:", jsonMetrics)
    return {
      coverage: {
        overall: jsonMetrics.coverage || 0,
        byDocument: jsonMetrics.documentCoverage || {}
      },
      questionQuality: {
        relevance: jsonMetrics.quality?.relevance || 0,
        clarity: jsonMetrics.quality?.clarity || 0,
        uniqueness: jsonMetrics.quality?.uniqueness || 0
      },
      questionTypes: {
        singleHop: jsonMetrics.questionTypes?.singleHop || 0,
        multiHop: jsonMetrics.questionTypes?.multiHop || 0,
        factual: jsonMetrics.questionTypes?.factual || 0,
        analytical: jsonMetrics.questionTypes?.analytical || 0
      },
      topicDistribution: jsonMetrics.topics || {},
      processingStats: {
        totalDocuments: jsonMetrics.totalDocuments || 0,
        totalQuestions: jsonMetrics.totalQuestions || 0,
        processingTime: jsonMetrics.processingTime || "0s",
        successRate: jsonMetrics.successRate || 0
      }
    }
  } catch (error) {
    console.error("Failed to parse JSON metrics:", error)
    console.log("Raw output:", output)
    
    // Fall back to parsing text output
    const metrics: AnalysisMetrics = {
      coverage: { overall: 0, byDocument: {} },
      questionQuality: { relevance: 0, clarity: 0, uniqueness: 0 },
      questionTypes: { singleHop: 0, multiHop: 0, factual: 0, analytical: 0 },
      topicDistribution: {},
      processingStats: { totalDocuments: 0, totalQuestions: 0, processingTime: "0s", successRate: 0 }
    }

    const lines = output.split("\n")
    for (const line of lines) {
      if (line.includes("Total Questions:")) {
        const match = line.match(/Total Questions: (\d+)/)
        if (match) {
          metrics.processingStats.totalQuestions = parseInt(match[1])
        }
      }
      else if (line.includes("Documents:")) {
        const match = line.match(/Documents: (\d+)/)
        if (match) {
          metrics.processingStats.totalDocuments = parseInt(match[1])
        }
      }
      else if (line.includes("Coverage:")) {
        const match = line.match(/Coverage: ([\d.]+)%/)
        if (match) {
          metrics.coverage.overall = parseFloat(match[1])
        }
      }
      else if (line.includes("Question Types:")) {
        const types = line.split(":")[1].trim().split(",")
        for (const type of types) {
          const [name, count] = type.trim().split("=")
          if (name in metrics.questionTypes) {
            metrics.questionTypes[name as keyof typeof metrics.questionTypes] = parseInt(count)
          }
        }
      }
      else if (line.includes("Quality:")) {
        const qualities = line.split(":")[1].trim().split(",")
        for (const quality of qualities) {
          const [metric, value] = quality.trim().split("=")
          if (metric in metrics.questionQuality) {
            metrics.questionQuality[metric as keyof typeof metrics.questionQuality] = parseFloat(value)
          }
        }
      }
      else if (line.includes("Topics:")) {
        const topics = line.split(":")[1].trim().split(",")
        for (const topic of topics) {
          const [name, count] = topic.trim().split("=")
          metrics.topicDistribution[name] = parseInt(count)
        }
      }
    }

    return metrics
  }
}