"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { EditProjectDialog } from "@/components/edit-project-dialog"
import { Button } from "@/components/ui/button"
import { useAppState } from "@/lib/store"
import { type Project } from "@/lib/mock-data"
import { Filter, Plus, LayoutGrid, List, Search, MoreHorizontal, Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectsPage() {
  const { state, deleteProject } = useAppState()
  const projects = state.projects
  const issues = state.issues
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "planned" | "completed">("all")
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null)

  const filteredProjects = statusFilter === "all" 
    ? projects 
    : projects.filter(p => p.status === statusFilter)

  const handleEditClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault()
    e.stopPropagation()
    setProjectToEdit(project)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (e: React.MouseEvent, projectId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setProjectToDelete(projectId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete)
      setProjectToDelete(null)
    }
    setDeleteDialogOpen(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border px-3 sm:px-4 py-2 sm:py-3 gap-2 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 min-w-0 w-full sm:w-auto flex-wrap">
            <h1 className="text-lg sm:text-xl font-semibold shrink-0">Projects</h1>
            <Button 
              variant={statusFilter === "all" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-xs sm:text-sm shrink-0 whitespace-nowrap"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={statusFilter === "active" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-xs sm:text-sm shrink-0 whitespace-nowrap"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button 
              variant={statusFilter === "planned" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-xs sm:text-sm shrink-0 whitespace-nowrap"
              onClick={() => setStatusFilter("planned")}
            >
              Planned
            </Button>
            <Button 
              variant={statusFilter === "completed" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-xs sm:text-sm shrink-0 whitespace-nowrap"
              onClick={() => setStatusFilter("completed")}
            >
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
            <Button size="sm" className="h-8 gap-1.5 shrink-0 whitespace-nowrap" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>New project</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const projectIssues = issues.filter((i) => i.projectId === project.id)
                const completedIssues = projectIssues.filter((i) => i.status === "done").length

                return (
                  <div
                    key={project.id}
                    className="group relative flex flex-col rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" />
                    
                    <div className="relative z-10 mb-4 flex items-start justify-between">
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
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={(e) => handleEditClick(e, project)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteClick(e, project.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Fixed height description area to keep progress bar aligned */}
                    <div className="relative z-10 mb-4 h-10 flex items-start">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description || " "}</p>
                    </div>

                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {completedIssues}/{projectIssues.length}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-1.5" />
                    </div>

                    <div className="relative z-10 mt-4 flex items-center gap-2">
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
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProjects.map((project) => {
                const projectIssues = issues.filter((i) => i.projectId === project.id)
                const completedIssues = projectIssues.filter((i) => i.status === "done").length

                return (
                  <div
                    key={project.id}
                    className="group relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" />
                    
                    <div
                      className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-2xl"
                      style={{ backgroundColor: `${project.color}20` }}
                    >
                      {project.icon}
                    </div>

                    <div className="relative z-10 flex-1">
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

                    <div className="relative z-10 flex shrink-0 items-center gap-6">
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
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem onClick={(e) => handleEditClick(e, project)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteClick(e, project.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      <CreateProjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <EditProjectDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} project={projectToEdit} />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
