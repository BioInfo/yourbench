import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs/promises"

// Create necessary directories if they don't exist
async function ensureDirectories() {
  const baseDir = path.join(process.cwd(), "..", "example")
  const rawDir = path.join(baseDir, "data", "raw")
  const processedDir = path.join(baseDir, "data", "processed")

  await fs.mkdir(rawDir, { recursive: true })
  await fs.mkdir(processedDir, { recursive: true })

  return { rawDir, processedDir }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Ensure directories exist
    const { rawDir } = await ensureDirectories()

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(rawDir, file.name)
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      message: "Document uploaded successfully",
      filePath
    })
  } catch (error) {
    console.error("Error processing document:", error)
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { rawDir, processedDir } = await ensureDirectories()

    // Get raw documents
    const rawFiles = await fs.readdir(rawDir)
    const rawDocs = await Promise.all(
      rawFiles.map(async (file) => {
        const stats = await fs.stat(path.join(rawDir, file))
        return {
          name: file,
          path: path.join(rawDir, file),
          size: stats.size,
          createdAt: stats.birthtime,
          status: "raw"
        }
      })
    )

    // Get processed documents
    const processedFiles = await fs.readdir(processedDir)
    const processedDocs = await Promise.all(
      processedFiles.map(async (file) => {
        const stats = await fs.stat(path.join(processedDir, file))
        return {
          name: file,
          path: path.join(processedDir, file),
          size: stats.size,
          createdAt: stats.birthtime,
          status: "processed"
        }
      })
    )

    return NextResponse.json({
      documents: [...rawDocs, ...processedDocs]
    })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    )
  }
}