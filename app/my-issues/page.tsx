"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { FilterDropdown } from "@/components/filter-dropdown"
import { type Issue } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"

export default function MyIssuesPage() {
  const { state, updateIssue, addIssue, deleteIssues } = useAppState()
  const allIssues = state.issues
  
  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [activeTab, setActiveTab] = useState<"assigned" | "created" | "subscribed">("assigned")
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

  // Get issues assigned to current user (using first user as example)
  const currentUserId = "1"
  const myIssues = useMemo(() => allIssues.filter((i) => i.assigneeId === currentUserId), [allIssues])
  const createdByMeIssues = useMemo(() => allIssues.filter((i) => i.createdBy === currentUserId), [allIssues])

  // Apply filters to issues
  const applyFilters = (issues: Issue[]) => {
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
  }

  const filteredMyIssues = useMemo(() => applyFilters(myIssues), [myIssues, filters])
  const filteredCreatedByMeIssues = useMemo(() => applyFilters(createdByMeIssues), [createdByMeIssues, filters])

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  const handleIssueStatusChange = (issueId: string, newStatus: Issue["status"]) => {
    updateIssue(issueId, { status: newStatus })
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus })
    }
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
      const issue = allIssues.find((i) => i.id === issueId)
      if (issue && !issue.labels.includes(labelId)) {
        updateIssue(issueId, { labels: [...issue.labels, labelId] })
      }
    })
  }

  const handleCreateIssue = (status: Issue["status"] = "todo") => {
    const newId = (Math.max(...allIssues.map(i => parseInt(i.id)), 0) + 1).toString()
    const tesNumbers = allIssues
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
      assigneeId: currentUserId,
      projectId: null,
      teamId: "1",
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: null,
      estimate: null,
      createdBy: currentUserId,
    }
    addIssue(newIssue)
    setSelectedIssue(newIssue)
    setIsModalOpen(true)
  }

  const handleIssueUpdate = (issueId: string, updates: Partial<Issue>) => {
    updateIssue(issueId, updates)
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, ...updates })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold shrink-0">My Issues</h1>
            <Button 
              variant={activeTab === "assigned" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-sm shrink-0 whitespace-nowrap"
              onClick={() => setActiveTab("assigned")}
            >
              Assigned to me
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{filteredMyIssues.length}</span>
            </Button>
            <Button 
              variant={activeTab === "created" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-sm shrink-0 whitespace-nowrap"
              onClick={() => setActiveTab("created")}
            >
              Created by me
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{filteredCreatedByMeIssues.length}</span>
            </Button>
            <Button 
              variant={activeTab === "subscribed" ? "secondary" : "ghost"} 
              size="sm" 
              className="h-7 text-sm shrink-0 whitespace-nowrap"
              onClick={() => setActiveTab("subscribed")}
            >
              Subscribed
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FilterDropdown filters={filters} onFiltersChange={setFilters} />
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-3">
          {activeTab === "assigned" && (
            <>
              {currentView === "list" && (
              <IssueListView 
                issues={filteredMyIssues} 
                onIssueClick={handleIssueClick}
                onDeleteIssues={handleDeleteIssues}
                onMoveToProject={handleMoveToProject}
                onAddLabel={handleAddLabel}
                onCreateIssue={handleCreateIssue}
              />
            )}
            {currentView === "board" && (
              <IssueBoardView
                issues={filteredMyIssues}
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
                issues={filteredMyIssues} 
                onIssueClick={handleIssueClick}
                onDeleteIssues={handleDeleteIssues}
                onMoveToProject={handleMoveToProject}
                onAddLabel={handleAddLabel}
                onCreateIssue={handleCreateIssue}
              />
            )}
            </>
          )}
          {activeTab === "created" && (
            <>
              {currentView === "list" && (
              <IssueListView 
                issues={filteredCreatedByMeIssues} 
                onIssueClick={handleIssueClick}
                onDeleteIssues={handleDeleteIssues}
                onMoveToProject={handleMoveToProject}
                onAddLabel={handleAddLabel}
                onCreateIssue={handleCreateIssue}
              />
            )}
            {currentView === "board" && (
              <IssueBoardView
                issues={filteredCreatedByMeIssues}
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
                issues={filteredCreatedByMeIssues} 
                onIssueClick={handleIssueClick}
                onDeleteIssues={handleDeleteIssues}
                onMoveToProject={handleMoveToProject}
                onAddLabel={handleAddLabel}
                onCreateIssue={handleCreateIssue}
              />
            )}
            </>
          )}
          {activeTab === "subscribed" && (
            <p className="text-sm text-muted-foreground">No subscribed issues yet</p>
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
    </div>
  )
}
