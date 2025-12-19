"use client"

import { use, useState } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"
import { ArrowLeft, MoreHorizontal, Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { IssueCard } from "@/components/issue-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { state } = useAppState()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const project = state.projects.find((p) => p.id === id)

  if (!project) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar onSearchClick={() => setIsCommandOpen(true)} />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Project not found</h1>
            <p className="text-muted-foreground mb-4">This project doesn't exist or has been deleted.</p>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </main>
        <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      </div>
    )
  }

  const projectIssues = state.issues.filter((i) => i.projectId === project.id)
  const groupedIssues = {
    todo: projectIssues.filter((i) => i.status === "todo"),
    "in-progress": projectIssues.filter((i) => i.status === "in-progress"),
    done: projectIssues.filter((i) => i.status === "done"),
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border px-4 py-3">
          <div className="mb-3 flex items-center gap-2">
            <Link href="/projects">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: `${project.color}20` }}
              >
                {project.icon}
              </div>
              <h1 className="text-xl font-semibold">{project.name}</h1>
            </div>
            <span
              className="ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
              style={{
                backgroundColor: `${project.color}20`,
                color: project.color,
              }}
            >
              {project.status}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="border-b border-border px-4 py-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Total Issues</p>
              <p className="text-2xl font-semibold">{projectIssues.length}</p>
            </div>
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Completed</p>
              <p className="text-2xl font-semibold">{groupedIssues.done.length}</p>
            </div>
            <div>
              <p className="mb-2 text-xs text-muted-foreground">Progress</p>
              <Progress value={project.progress} className="h-2" />
              <p className="mt-1 text-sm font-medium">{project.progress}%</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border px-4">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger value="issues" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Issues
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Activity
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="m-0 p-4">
              <div className="space-y-6">
                {Object.entries(groupedIssues).map(([status, issues]) => {
                  if (issues.length === 0) return null
                  const labels = {
                    todo: "Todo",
                    "in-progress": "In Progress",
                    done: "Done",
                  }

                  return (
                    <div key={status}>
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          {labels[status as keyof typeof labels]} ({issues.length})
                        </h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {issues.map((issue) => (
                          <IssueCard key={issue.id} issue={issue} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="issues" className="m-0 p-4">
              <div className="space-y-1">
                {projectIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="m-0 p-4">
              <p className="text-sm text-muted-foreground">Activity timeline coming soon...</p>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
