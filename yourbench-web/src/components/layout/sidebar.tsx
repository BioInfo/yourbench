import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={`pb-12 w-64 border-r ${className}`}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start" asChild>
              <Link href="/documents/upload">
                + New Document
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Quick Actions
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/pipeline/new">
                New Pipeline
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/templates">
                Templates
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/analysis/dashboard">
                Analysis Dashboard
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Recent Documents
          </h2>
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Document Tree</CardTitle>
              <CardDescription>Your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 p-2">
                {/* Document tree will be populated dynamically */}
                <p className="px-2 py-1 text-sm text-muted-foreground">
                  No documents yet
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Recent Pipelines
          </h2>
          <div className="space-y-1">
            {/* Recent pipelines will be populated dynamically */}
            <p className="px-4 py-1 text-sm text-muted-foreground">
              No recent pipelines
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}