import { NextRequest, NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"
import path from "path"
import fs from "fs/promises"

const execAsync = promisify(exec)

interface DatasetInfo {
  name: string
  description: string
  tags: string[]
  lastModified: string
  questionCount: number
  size: number
}

// Get datasets from Hugging Face Hub
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const query = searchParams.get("query") || ""
    const organization = process.env.HF_ORGANIZATION

    // Search for datasets
    const { stdout } = await execAsync(
      `yourbench search-datasets --org ${organization} --query "${query}"`
    )

    // Parse dataset information
    const datasets = parseDatasetInfo(stdout)

    return NextResponse.json({ datasets })
  } catch (error) {
    console.error("Error fetching datasets:", error)
    return NextResponse.json(
      { error: "Failed to fetch datasets" },
      { status: 500 }
    )
  }
}

// Push dataset to Hugging Face Hub
export async function POST(req: NextRequest) {
  try {
    const { name, description, private: isPrivate } = await req.json()

    if (!name) {
      return NextResponse.json(
        { error: "Dataset name is required" },
        { status: 400 }
      )
    }

    // Ensure processed data exists
    const processedDir = path.join(process.cwd(), "example/data/processed")
    const hasProcessedData = await fs.access(processedDir)
      .then(() => true)
      .catch(() => false)

    if (!hasProcessedData) {
      return NextResponse.json(
        { error: "No processed data available to push" },
        { status: 400 }
      )
    }

    // Push to Hub
    const { stdout, stderr } = await execAsync(
      `yourbench push-to-hub --name ${name} ${
        description ? `--description "${description}"` : ""
      } ${isPrivate ? "--private" : ""}`
    )

    return NextResponse.json({
      message: "Dataset pushed successfully",
      stdout,
      stderr
    })
  } catch (error) {
    console.error("Error pushing dataset:", error)
    return NextResponse.json(
      { error: "Failed to push dataset" },
      { status: 500 }
    )
  }
}

// Pull dataset from Hugging Face Hub
export async function PUT(req: NextRequest) {
  try {
    const { dataset } = await req.json()

    if (!dataset) {
      return NextResponse.json(
        { error: "Dataset name is required" },
        { status: 400 }
      )
    }

    // Pull from Hub
    const { stdout, stderr } = await execAsync(
      `yourbench pull-from-hub --dataset ${dataset}`
    )

    return NextResponse.json({
      message: "Dataset pulled successfully",
      stdout,
      stderr
    })
  } catch (error) {
    console.error("Error pulling dataset:", error)
    return NextResponse.json(
      { error: "Failed to pull dataset" },
      { status: 500 }
    )
  }
}

function parseDatasetInfo(output: string): DatasetInfo[] {
  const datasets: DatasetInfo[] = []
  const lines = output.split("\n")

  let currentDataset: Partial<DatasetInfo> = {}
  
  for (const line of lines) {
    if (line.startsWith("Name:")) {
      if (currentDataset.name) {
        datasets.push(currentDataset as DatasetInfo)
        currentDataset = {}
      }
      currentDataset.name = line.replace("Name:", "").trim()
    }
    else if (line.startsWith("Description:")) {
      currentDataset.description = line.replace("Description:", "").trim()
    }
    else if (line.startsWith("Tags:")) {
      currentDataset.tags = line
        .replace("Tags:", "")
        .trim()
        .split(",")
        .map(t => t.trim())
    }
    else if (line.startsWith("Last Modified:")) {
      currentDataset.lastModified = line.replace("Last Modified:", "").trim()
    }
    else if (line.startsWith("Questions:")) {
      currentDataset.questionCount = parseInt(
        line.replace("Questions:", "").trim()
      )
    }
    else if (line.startsWith("Size:")) {
      currentDataset.size = parseInt(
        line.replace("Size:", "").trim()
      )
    }
  }

  if (currentDataset.name) {
    datasets.push(currentDataset as DatasetInfo)
  }

  return datasets
}