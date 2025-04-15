import { NextRequest, NextResponse } from "next/server"
import { spawn, ChildProcess } from "child_process"
import path from "path"
import fs from "fs/promises"
import yaml from "yaml"

interface PipelineStatus {
  status: "idle" | "running" | "completed" | "error"
  progress: number | null
  results: {
    questionCount?: number
    coverage?: number
    processingTime?: string
  } | null
  logs?: string[]
}

interface PipelineState {
  status: PipelineStatus
  process?: ChildProcess
  logs: string[]
}

let currentPipeline: PipelineState = {
  status: {
    status: "idle",
    progress: null,
    results: null,
    logs: []
  },
  logs: []
}

// Ensure configs directory exists
async function ensureConfigDir() {
  const configDir = path.join(process.cwd(), "..", "configs")
  await fs.mkdir(configDir, { recursive: true })
  return configDir
}

export async function GET() {
  try {
    // Return current status
    return NextResponse.json({
      ...currentPipeline.status,
      logs: currentPipeline.logs
    })
  } catch (error) {
    console.error("Error getting pipeline status:", error)
    return NextResponse.json(
      { error: "Failed to get pipeline status" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { config } = await req.json()

    // Validate config
    if (!config) {
      return NextResponse.json(
        { error: "No configuration provided" },
        { status: 400 }
      )
    }

    // Ensure config directory exists and get path
    const configDir = await ensureConfigDir()
    const configPath = path.join(configDir, "pipeline.yaml")

    // Save config to file
    await fs.writeFile(configPath, yaml.stringify(config))

    // Reset pipeline state
    currentPipeline = {
      status: {
        status: "running",
        progress: 0,
        results: null,
        logs: []
      },
      logs: []
    }

    // Start pipeline process
    const pipelineProcess = spawn("yourbench", ["run", "--config", configPath], {
      cwd: path.join(process.cwd(), ".."),
    })

    currentPipeline.process = pipelineProcess

    // Handle output streams
    pipelineProcess.stdout?.on("data", (data: Buffer) => {
      const output = data.toString()
      currentPipeline.logs.push(output)
      console.log("Pipeline output:", output)

      // Parse progress
      if (output.includes("Progress:")) {
        const match = output.match(/Progress: (\d+)%/)
        if (match) {
          currentPipeline.status.progress = parseInt(match[1])
        }
      }

      // Parse results
      if (output.includes("Generated questions:")) {
        const match = output.match(/Generated (\d+) questions/)
        if (match) {
          currentPipeline.status.results = {
            ...currentPipeline.status.results,
            questionCount: parseInt(match[1])
          }
        }
      }
    })

    pipelineProcess.stderr?.on("data", (data: Buffer) => {
      const error = data.toString()
      currentPipeline.logs.push(`Error: ${error}`)
      console.error("Pipeline error:", error)
    })

    pipelineProcess.on("close", (code: number | null) => {
      currentPipeline.status.status = code === 0 ? "completed" : "error"
      console.log(`Pipeline process exited with code ${code}`)
    })

    return NextResponse.json({
      message: "Pipeline started",
      status: currentPipeline.status
    })
  } catch (error) {
    console.error("Error starting pipeline:", error)
    return NextResponse.json(
      { error: "Failed to start pipeline" },
      { status: 500 }
    )
  }
}