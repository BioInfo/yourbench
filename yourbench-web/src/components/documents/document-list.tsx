"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatBytes, formatDate } from "@/lib/utils"

export function DocumentList() {
  const { documents, fetchDocuments, loadingDocuments } = useStore()

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Library</CardTitle>
        <CardDescription>
          Your uploaded documents and their processing status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium">
            <div className="col-span-2">Name</div>
            <div>Size</div>
            <div>Status</div>
            <div>Created</div>
          </div>
          <div className="divide-y divide-border rounded-md border-t">
            {loadingDocuments ? (
              <div className="grid grid-cols-5 gap-4 p-4 items-center">
                <div className="col-span-5 text-center">
                  <p className="text-sm text-muted-foreground">Loading documents...</p>
                </div>
              </div>
            ) : documents.length === 0 ? (
              <div className="grid grid-cols-5 gap-4 p-4 items-center">
                <div className="col-span-5 text-center">
                  <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                </div>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.path} className="grid grid-cols-5 gap-4 p-4 items-center">
                  <div className="col-span-2">
                    <p className="font-medium">{doc.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(doc.size)}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      doc.status === "processed" 
                        ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20"
                        : "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20"
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(doc.createdAt))}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}