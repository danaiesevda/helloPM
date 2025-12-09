"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { mockProjects, mockIssues } from "@/lib/mock-data"
import { Plus, Settings, ChevronDown, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function RoadmapPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const quarters = [
    { id: "q1-2024", label: "Q1 2024", months: ["Jan", "Feb", "Mar"] },
    { id: "q2-2024", label: "Q2 2024", months: ["Apr", "May", "Jun"] },
    { id: "q3-2024", label: "Q3 2024", months: ["Jul", "Aug", "Sep"] },
    { id: "q4-2024", label: "Q4 2024", months: ["Oct", "Nov", "Dec"] },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Roadmap</h1>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
              <span>2024</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-sm">
              Quarters
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-sm">
              Months
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-4 w-4" />
              <span>New milestone</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {quarters.map((quarter) => (
              <div key={quarter.id}>
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{quarter.label}</h2>
                  <span className="text-sm text-muted-foreground">{quarter.months.join(" - ")}</span>
                </div>

                <div className="space-y-3">
                  {mockProjects
                    .filter((p) => p.status === "active")
                    .map((project) => {
                      const projectIssues = mockIssues.filter((i) => i.projectId === project.id)
                      const completedIssues = projectIssues.filter((i) => i.status === "done").length

                      return (
                        <div key={project.id} className="rounded-lg border border-border bg-card p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl"
                                style={{
                                  backgroundColor: `${project.color}20`,
                                }}
                              >
                                {project.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                              </div>
                            </div>
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                              style={{
                                backgroundColor: `${project.color}20`,
                                color: project.color,
                              }}
                            >
                              {project.status}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {completedIssues}/{projectIssues.length} issues
                              </span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">
                                {projectIssues.filter((i) => i.status === "todo").length}
                              </span>
                              <span>Todo</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">
                                {projectIssues.filter((i) => i.status === "in-progress").length}
                              </span>
                              <span>In Progress</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{completedIssues}</span>
                              <span>Done</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
