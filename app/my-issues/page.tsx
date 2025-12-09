"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { FilterDropdown } from "@/components/filter-dropdown"
import { mockIssues, type Issue } from "@/lib/mock-data"
import { Settings } from "lucide-react"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MyIssuesPage() {
  const [currentView, setCurrentView] = useState<ViewType>("list")
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
  const [myIssues, setMyIssues] = useState<Issue[]>(mockIssues.filter((i) => i.assigneeId === currentUserId))
  const [createdByMeIssues, setCreatedByMeIssues] = useState<Issue[]>(
    mockIssues.filter((i) => i.assigneeId === currentUserId)
  )

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
    // Update assigned issues
    setMyIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue))
    )

    // Update created by me issues
    setCreatedByMeIssues((prevIssues) =>
      prevIssues.map((issue) => (issue.id === issueId ? { ...issue, status: newStatus } : issue))
    )

    // Update selected issue if it's the one being changed
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus })
    }
  }

  const handleDeleteIssues = (issueIds: string[]) => {
    setMyIssues((prevIssues) => prevIssues.filter((issue) => !issueIds.includes(issue.id)))
    setCreatedByMeIssues((prevIssues) => prevIssues.filter((issue) => !issueIds.includes(issue.id)))
  }

  const handleMoveToProject = (issueIds: string[], projectId: string | null) => {
    setMyIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, projectId } : issue
      )
    )
    setCreatedByMeIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issueIds.includes(issue.id) ? { ...issue, projectId } : issue
      )
    )
  }

  const handleAddLabel = (issueIds: string[], labelId: string) => {
    setMyIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issueIds.includes(issue.id)
          ? { ...issue, labels: issue.labels.includes(labelId) ? issue.labels : [...issue.labels, labelId] }
          : issue
      )
    )
    setCreatedByMeIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issueIds.includes(issue.id)
          ? { ...issue, labels: issue.labels.includes(labelId) ? issue.labels : [...issue.labels, labelId] }
          : issue
      )
    )
  }

  const handleCreateIssue = (status: Issue["status"] = "todo") => {
    const allIssues = [...myIssues, ...createdByMeIssues]
    const newId = (Math.max(...allIssues.map(i => parseInt(i.id)), 0) + 1).toString()
    const tesNumbers = allIssues
      .map(i => {
        const match = i.identifier.match(/TES-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
    const nextTesNumber = Math.max(...tesNumbers, 0) + 1
    const newIssue: Issue = {
      id: newId,
      identifier: `TES-${nextTesNumber}`,
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
    setMyIssues((prevIssues) => [newIssue, ...prevIssues])
    setCreatedByMeIssues((prevIssues) => [newIssue, ...prevIssues])
    setSelectedIssue(newIssue)
    setIsModalOpen(true)
  }

  const handleIssueUpdate = (issueId: string, updates: Partial<Issue>) => {
    setMyIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates, updatedAt: new Date().toISOString() } : issue
      )
    )
    setCreatedByMeIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates, updatedAt: new Date().toISOString() } : issue
      )
    )
    if (selectedIssue?.id === issueId) {
      setSelectedIssue({ ...selectedIssue, ...updates })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">My Issues</h1>
          </div>

          <div className="flex items-center gap-2">
            <FilterDropdown filters={filters} onFiltersChange={setFilters} />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <Tabs defaultValue="assigned" className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border px-4">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger
                value="assigned"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Assigned to me
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{filteredMyIssues.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Created by me
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{filteredCreatedByMeIssues.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="subscribed"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Subscribed
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto px-4 py-3">
            <TabsContent value="assigned" className="m-0">
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
            </TabsContent>

            <TabsContent value="created" className="m-0">
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
            </TabsContent>

            <TabsContent value="subscribed" className="m-0">
              <p className="text-sm text-muted-foreground">No subscribed issues yet</p>
            </TabsContent>
          </div>
        </Tabs>
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
