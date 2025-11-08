"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { CommandPalette } from "@/components/command-palette"
import { FilterDropdown } from "@/components/filter-dropdown"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"
import { mockIssues, type Issue } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Plus, Bell, Settings, ChevronDown, Search } from "lucide-react"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [issues, setIssues] = useState<Issue[]>(mockIssues)
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
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
      setIssues((prevIssues) =>
        prevIssues.map((issue) =>
          issue.id === draggedIssue.id ? { ...issue, status } : issue
        )
      )
    }
    setDraggedIssue(null)
  }

  const handleIssueStatusChange = (issueId: string, newStatus: Issue["status"]) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    )
    // Update selected issue if it's the one being changed
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus })
    }
  }

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  // Apply filters to issues
  const filteredIssues = issues.filter((issue) => {
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-2 gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm shrink-0">
              <span className="whitespace-nowrap">All issues</span>
              <ChevronDown className="h-3 w-3 shrink-0" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Active
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-sm shrink-0 whitespace-nowrap">
              Backlog
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" className="h-7 gap-2 text-sm shrink-0" onClick={() => setIsCommandOpen(true)}>
              <Search className="h-4 w-4 shrink-0" />
              <span className="text-muted-foreground whitespace-nowrap">Search</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 sm:flex shrink-0">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <Bell className="h-4 w-4" />
            </Button>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-2">
            <FilterDropdown filters={filters} onFiltersChange={setFilters} />
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
              <span>Status</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
              <span>Priority</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
              <span>Assignee</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>

          <Button size="sm" className="h-7 gap-1 text-sm">
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
            />
          )}
          {currentView === "board" && (
            <IssueBoardView
              issues={filteredIssues}
              onIssueClick={handleIssueClick}
              onIssueStatusChange={handleIssueStatusChange}
            />
          )}
          {currentView === "table" && <IssueTableView issues={filteredIssues} onIssueClick={handleIssueClick} />}
        </div>
      </main>

      <IssueDetailModal issue={selectedIssue} open={isModalOpen} onOpenChange={setIsModalOpen} />

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
