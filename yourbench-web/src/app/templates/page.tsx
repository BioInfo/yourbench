import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pipeline Templates</h1>
          <p className="text-muted-foreground">
            Manage and use pipeline configuration templates
          </p>
        </div>
        <Button asChild>
          <Link href="/pipeline/new">Create New Template</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Template */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Pipeline</CardTitle>
            <CardDescription>
              Standard pipeline configuration with default settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Last Modified</p>
                  <p className="text-sm text-muted-foreground">Never</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Created By</p>
                  <p className="text-sm text-muted-foreground">System</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" asChild>
                  <Link href="/pipeline/new">Use Template</Link>
                </Button>
                <Button className="flex-1" variant="outline">
                  Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create New Template Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Create New Template</CardTitle>
            <CardDescription>
              Create a custom pipeline configuration template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[120px]">
              <Button variant="outline" asChild>
                <Link href="/pipeline/new">
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
                    className="mr-2 h-4 w-4"
                  >
                    <line x1="12" x2="12" y1="5" y2="19" />
                    <line x1="5" x2="19" y1="12" y2="12" />
                  </svg>
                  Create Template
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}