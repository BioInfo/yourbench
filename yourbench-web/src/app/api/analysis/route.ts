import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs/promises"

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
    // Get analysis data from logs and processed files
    const metrics = await collectAnalysisMetrics()
    return NextResponse.json(metrics)
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return NextResponse.json(
      { error: "Failed to fetch analysis data" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { documentIds } = await req.json()

    // Run analysis on specific documents
    const { stdout, stderr } = await execAsync(
      `yourbench analyze ${documentIds ? `--documents ${documentIds.join(",")}` : ""}`
    )

    // Get updated metrics
    const metrics = await collectAnalysisMetrics()

    return NextResponse.json({
      message: "Analysis completed",
      metrics,
      stdout,
      stderr
    })
  } catch (error) {
    console.error("Error running analysis:", error)
    return NextResponse.json(
      { error: "Failed to run analysis" },
      { status: 500 }
    )
  }
}

async function collectAnalysisMetrics(): Promise<AnalysisMetrics> {
  const processedDir = path.join(process.cwd(), "example/data/processed")
  const logsDir = path.join(process.cwd(), "logs")

  // Get processed documents
  const processedFiles = await fs.readdir(processedDir)
  
  // Calculate coverage per document
  const coverageByDocument: Record<string, number> = {}
  let totalCoverage = 0

  for (const file of processedFiles) {
    const content = await fs.readFile(
      path.join(processedDir, file),
      "utf-8"
    )
    const coverage = calculateDocumentCoverage(content)
    coverageByDocument[file] = coverage
    totalCoverage += coverage
  }

  // Get latest log file
  const logFiles = (await fs.readdir(logsDir))
    .filter(f => f.endsWith(".log"))
    .sort()
    .reverse()

  const latestLog = logFiles[0]
  const logContent = latestLog 
    ? await fs.readFile(path.join(logsDir, latestLog), "utf-8")
    : ""

  // Parse metrics from log
  const questionMetrics = parseQuestionMetrics(logContent)
  const processingStats = parseProcessingStats(logContent)
  const topicDistribution = analyzeTopicDistribution(processedFiles)

  return {
    coverage: {
      overall: totalCoverage / processedFiles.length,
      byDocument: coverageByDocument
    },
    questionQuality: questionMetrics.quality,
    questionTypes: questionMetrics.types,
    topicDistribution,
    processingStats
  }
}

function calculateDocumentCoverage(content: string): number {
  // Analyze markdown content to determine coverage
  const sections = content.split("\n\n")
  let coveredSections = 0

  for (const section of sections) {
    if (section.includes("Q:") || section.includes("A:")) {
      coveredSections++
    }
  }

  return (coveredSections / sections.length) * 100
}

function parseQuestionMetrics(logContent: string) {
  const metrics = {
    quality: {
      relevance: 0,
      clarity: 0,
      uniqueness: 0
    },
    types: {
      singleHop: 0,
      multiHop: 0,
      factual: 0,
      analytical: 0
    }
  }

  const lines = logContent.split("\n")
  
  for (const line of lines) {
    if (line.includes("Relevance Score:")) {
      metrics.quality.relevance = parseFloat(line.split(":")[1])
    }
    if (line.includes("Clarity Score:")) {
      metrics.quality.clarity = parseFloat(line.split(":")[1])
    }
    if (line.includes("Uniqueness Score:")) {
      metrics.quality.uniqueness = parseFloat(line.split(":")[1])
    }
    if (line.includes("Question Types:")) {
      const types = line.split(":")[1].trim().split(",")
      for (const type of types) {
        const [name, count] = type.trim().split(" ")
        if (name in metrics.types) {
          metrics.types[name as keyof typeof metrics.types] = parseInt(count)
        }
      }
    }
  }

  return metrics
}

function parseProcessingStats(logContent: string) {
  const stats = {
    totalDocuments: 0,
    totalQuestions: 0,
    processingTime: "",
    successRate: 0
  }

  const lines = logContent.split("\n")
  
  for (const line of lines) {
    if (line.includes("Total Documents:")) {
      stats.totalDocuments = parseInt(line.split(":")[1])
    }
    if (line.includes("Total Questions:")) {
      stats.totalQuestions = parseInt(line.split(":")[1])
    }
    if (line.includes("Processing Time:")) {
      stats.processingTime = line.split(":")[1].trim()
    }
    if (line.includes("Success Rate:")) {
      stats.successRate = parseFloat(line.split(":")[1])
    }
  }

  return stats
}

function analyzeTopicDistribution(files: string[]): Record<string, number> {
  // Simple topic analysis based on filename patterns
  const topics: Record<string, number> = {}

  for (const file of files) {
    const topic = file.split("_")[0].toLowerCase()
    topics[topic] = (topics[topic] || 0) + 1
  }

  return topics
}