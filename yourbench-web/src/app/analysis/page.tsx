import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function AnalysisPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analysis Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze benchmark results and metrics
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Export Report</Button>
          <Button>Refresh Data</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <Progress value={0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Question Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <Progress value={0} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              After deduplication
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0s</div>
            <p className="text-xs text-muted-foreground">
              Average per document
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="coverage">Coverage</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Processing Overview</CardTitle>
                <CardDescription>
                  Document processing and question generation metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <p className="text-sm text-muted-foreground">No data available</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Question Distribution</CardTitle>
                <CardDescription>
                  Distribution of questions across documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <p className="text-sm text-muted-foreground">No data available</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Topic Coverage</CardTitle>
                <CardDescription>
                  Coverage of topics across documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <p className="text-sm text-muted-foreground">No data available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="questions">
          <Card>
            <CardHeader>
              <CardTitle>Generated Questions</CardTitle>
              <CardDescription>
                Review and analyze generated questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-4 p-4 font-medium">
                  <div className="col-span-2">Question</div>
                  <div>Type</div>
                  <div>Source</div>
                  <div>Actions</div>
                </div>
                <div className="divide-y divide-border rounded-md border-t">
                  <div className="grid grid-cols-5 gap-4 p-4 items-center">
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">
                        No questions generated yet
                      </p>
                    </div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="coverage">
          <Card>
            <CardHeader>
              <CardTitle>Document Coverage Analysis</CardTitle>
              <CardDescription>
                Analyze coverage of source documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-sm text-muted-foreground">No coverage data available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Pipeline performance and resource usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-sm text-muted-foreground">No performance data available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}