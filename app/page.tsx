"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { CommandPalette } from "@/components/command-palette"
import { FilterDropdown } from "@/components/filter-dropdown"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"
import { type Issue } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Bell, ChevronDown } from "lucide-react"
import { WelcomeModal } from "@/components/welcome-modal"
import { NotificationDropdown } from "@/components/notification-dropdown"

export default function Home() {
  const { state, updateIssue, addIssue, deleteIssues } = useAppState()
  const issues = state.issues
  const users = state.users
  const projects = state.projects
  
  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false)
  const [filters, setFilters] = useState<{
    status: string[]
    priority: string[]
    assignee: string[]
    project: string[]
  }>({
    status: [],
    priority: [],
    assignee: [],
    project: [],
  })

  const handleDragStart = (issue: Issue) => {
    setDraggedIssue(issue)
  }

  const handleDrop = (status: Issue["status"]) => {
    if (draggedIssue) {
      updateIssue(draggedIssue.id, { status })
    }
    setDraggedIssue(null)
  }

  const handleIssueStatusChange = (issueId: string, newStatus: Issue["status"]) => {
    updateIssue(issueId, { status: newStatus })
    // Update selected issue if it's the one being changed
    if (selectedIssue?.id === issueId) {
      const updatedIssue = { ...selectedIssue, status: newStatus }
      setSelectedIssue(updatedIssue)
    }
  }

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  const handleDeleteIssues = (issueIds: string[]) => {
    deleteIssues(issueIds)
  }

  const handleMoveToProject = (issueIds: string[], projectId: string | null) => {
    issueIds.forEach((issueId) => {
      updateIssue(issueId, { projectId })
    })
  }

  const handleAddLabel = (issueIds: string[], labelId: string) => {
    issueIds.forEach((issueId) => {
      const issue = issues.find((i) => i.id === issueId)
      if (issue && !issue.labels.includes(labelId)) {
        updateIssue(issueId, { labels: [...issue.labels, labelId] })
      }
    })
  }

  const handleIssueUpdate = (issueId: string, updates: Partial<Issue>) => {
    updateIssue(issueId, updates)
    // Update selected issue if it's the one being changed
    if (selectedIssue?.id === issueId) {
      const updatedIssue = { ...selectedIssue, ...updates }
      setSelectedIssue(updatedIssue)
    }
  }

  const handleCreateIssue = (status: Issue["status"] = "todo") => {
    const newId = (Math.max(...issues.map(i => parseInt(i.id)), 0) + 1).toString()
    // Find the highest TES number from existing identifiers
    const tesNumbers = issues
      .map(i => {
        const match = i.identifier.match(/TASK-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
    const nextTaskNumber = Math.max(...tesNumbers, 0) + 1
    const newIssue: Issue = {
      id: newId,
      identifier: `TASK-${nextTaskNumber}`,
      title: "New issue",
      description: "",
      status,
      priority: "none",
      assigneeId: null,
      projectId: null,
      teamId: "1",
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: null,
      estimate: null,
      createdBy: "1",
    }
    addIssue(newIssue)
    // Open the modal to edit the new issue
    setSelectedIssue(newIssue)
    setIsModalOpen(true)
  }

  // Apply filters to issues - use useMemo to react to state changes
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      if (filters.status.length > 0 && !filters.status.includes(issue.status)) {
        return false
      }
      if (filters.priority.length > 0 && !filters.priority.includes(issue.priority)) {
        return false
      }
      if (filters.assignee.length > 0 && issue.assigneeId && !filters.assignee.includes(issue.assigneeId)) {
        return false
      }
      if (filters.project.length > 0 && issue.projectId && !filters.project.includes(issue.projectId)) {
        return false
      }
      return true
    })
  }, [issues, filters])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold shrink-0">All Issues</h1>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Active
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Backlog
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <NotificationDropdown />
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <FilterDropdown filters={filters} onFiltersChange={setFilters} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
                  <span>Status</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                {["backlog", "todo", "in-progress", "done", "canceled"].map((status) => (
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={filters.status.includes(status)}
                    onCheckedChange={(checked) => {
                      const newFilters = { ...filters }
                      if (checked) {
                        newFilters.status = [...newFilters.status, status]
                      } else {
                        newFilters.status = newFilters.status.filter((s) => s !== status)
                      }
                      setFilters(newFilters)
                    }}
                  >
                    <span className="capitalize">{status.replace("-", " ")}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
                  <span>Priority</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
                {["urgent", "high", "medium", "low", "none"].map((priority) => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={filters.priority.includes(priority)}
                    onCheckedChange={(checked) => {
                      const newFilters = { ...filters }
                      if (checked) {
                        newFilters.priority = [...newFilters.priority, priority]
                      } else {
                        newFilters.priority = newFilters.priority.filter((p) => p !== priority)
                      }
                      setFilters(newFilters)
                    }}
                  >
                    <span className="capitalize">{priority}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
                  <span>Assignee</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Filter by Assignee</DropdownMenuLabel>
                {users.map((user) => (
                  <DropdownMenuCheckboxItem
                    key={user.id}
                    checked={filters.assignee.includes(user.id)}
                    onCheckedChange={(checked) => {
                      const newFilters = { ...filters }
                      if (checked) {
                        newFilters.assignee = [...newFilters.assignee, user.id]
                      } else {
                        newFilters.assignee = newFilters.assignee.filter((id) => id !== user.id)
                      }
                      setFilters(newFilters)
                    }}
                  >
                    {user.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button size="sm" className="h-7 gap-1 text-sm" onClick={() => handleCreateIssue("todo")}>
            <Plus className="h-3 w-3" />
            <span>New issue</span>
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-4 py-3">
          {currentView === "list" && (
            <IssueListView
              issues={filteredIssues}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onIssueClick={handleIssueClick}
              onDeleteIssues={handleDeleteIssues}
              onMoveToProject={handleMoveToProject}
              onAddLabel={handleAddLabel}
              onCreateIssue={handleCreateIssue}
            />
          )}
          {currentView === "board" && (
            <IssueBoardView
              issues={filteredIssues}
              onIssueClick={handleIssueClick}
              onIssueStatusChange={handleIssueStatusChange}
              onCreateIssue={handleCreateIssue}
              onDeleteIssues={handleDeleteIssues}
              onMoveToProject={handleMoveToProject}
              onAddLabel={handleAddLabel}
            />
          )}
          {currentView === "table" && (
            <IssueTableView 
              issues={filteredIssues} 
              onIssueClick={handleIssueClick}
              onDeleteIssues={handleDeleteIssues}
              onMoveToProject={handleMoveToProject}
              onAddLabel={handleAddLabel}
              onCreateIssue={handleCreateIssue}
            />
          )}
        </div>
      </main>

      <IssueDetailModal 
        issue={selectedIssue} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onIssueUpdate={handleIssueUpdate}
      />

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
      <WelcomeModal open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen} />
    </div>
  )
}
