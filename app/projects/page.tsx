"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { mockProjects, mockIssues } from "@/lib/mock-data"
import { Filter, Plus, Settings, LayoutGrid, List, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold shrink-0">Projects</h1>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Active
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Planned
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Completed
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input placeholder="Search projects..." className="h-8 w-64 pl-8 text-sm" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1 shrink-0">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-6 w-6"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="h-6 w-6"
                onClick={() => setViewMode("list")}
              >
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Button size="sm" className="h-8 gap-1.5 shrink-0 whitespace-nowrap">
              <Plus className="h-4 w-4" />
              <span>New project</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project) => {
                const projectIssues = mockIssues.filter((i) => i.projectId === project.id)
                const completedIssues = projectIssues.filter((i) => i.status === "done").length

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl"
                          style={{ backgroundColor: `${project.color}20` }}
                        >
                          {project.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">{projectIssues.length} issues</p>
                        </div>
                      </div>
                    </div>

                    <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {completedIssues}/{projectIssues.length}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${project.color}20`,
                          color: project.color,
                        }}
                      >
                        {project.status}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {mockProjects.map((project) => {
                const projectIssues = mockIssues.filter((i) => i.projectId === project.id)
                const completedIssues = projectIssues.filter((i) => i.status === "done").length

                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      {project.icon}
                    </div>

                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <h3 className="font-semibold text-foreground group-hover:text-primary">{project.name}</h3>
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: `${project.color}20`,
                            color: project.color,
                          }}
                        >
                          {project.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Issues</p>
                        <p className="text-lg font-semibold">{projectIssues.length}</p>
                      </div>
                      <div className="w-32">
                        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
