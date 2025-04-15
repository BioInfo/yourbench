"use client"

import { useState, useCallback } from "react"
import { useStore } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

export function UploadZone() {
  const { uploadDocument, uploadingDocument } = useStore()
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    try {
      for (const file of files) {
        await uploadDocument(file)
      }
      toast.success("Upload Complete", {
        description: `Successfully uploaded ${files.length} file(s)`,
      })
    } catch (error) {
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "Failed to upload files",
      })
    }
  }, [uploadDocument])

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    try {
      for (const file of files) {
        await uploadDocument(file)
      }
      toast.success("Upload Complete", {
        description: `Successfully uploaded ${files.length} file(s)`,
      })
    } catch (error) {
      toast.error("Upload Failed", {
        description: error instanceof Error ? error.message : "Failed to upload files",
      })
    }

    // Reset input
    e.target.value = ""
  }, [uploadDocument])

  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${dragActive ? "border-primary bg-primary/5" : "hover:border-primary"}
        ${uploadingDocument ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => {
        if (!uploadingDocument) {
          document.getElementById("file-upload")?.click()
        }
      }}
    >
      <div className="flex flex-col items-center gap-2">
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
          className={`h-8 w-8 ${uploadingDocument ? "text-muted-foreground/50" : "text-muted-foreground"}`}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <p className={`text-sm ${uploadingDocument ? "text-muted-foreground/50" : "text-muted-foreground"}`}>
          {uploadingDocument 
            ? "Uploading..."
            : "Drag and drop files here or click to browse"
          }
        </p>
      </div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.html,.txt"
        onChange={handleFileSelect}
        disabled={uploadingDocument}
      />
      {uploadingDocument && (
        <div className="mt-4">
          <Progress value={undefined} className="h-2" />
        </div>
      )}
    </div>
  )
}