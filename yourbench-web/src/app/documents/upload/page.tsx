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
import { UploadZone } from "@/components/upload/upload-zone"

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Upload Documents</h1>
          <p className="text-muted-foreground">
            Upload documents for benchmark generation
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/documents">Back to Documents</Link>
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Supported formats: PDF, Word, HTML, Text
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8">
              <UploadZone />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Upload Progress</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">No files selected</p>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Processing Options</CardTitle>
            <CardDescription>
              Configure how your documents will be processed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Document Tags</h3>
                <p className="text-sm text-muted-foreground">
                  Add tags to organize your documents (optional)
                </p>
                {/* Tag input will go here */}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Processing Priority</h3>
                <p className="text-sm text-muted-foreground">
                  Select processing priority for your documents
                </p>
                {/* Priority selection will go here */}
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Auto-start Pipeline</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically start processing after upload
                </p>
                {/* Auto-start toggle will go here */}
              </div>

              <Button className="w-full" disabled>
                Start Upload
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}