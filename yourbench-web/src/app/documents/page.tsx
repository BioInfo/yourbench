import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DocumentList } from "@/components/documents/document-list"

export default function DocumentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage your source documents for benchmark generation
          </p>
        </div>
        <Button asChild>
          <Link href="/documents/upload">Upload Document</Link>
        </Button>
      </div>

      <DocumentList />
    </div>
  )
}