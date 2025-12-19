"use client"

import { use, useState, useMemo } from "react"
import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { type Issue } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Filter } from "lucide-react"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"

export default function TeamIssuesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { state, updateIssue, addIssue, deleteIssues } = useAppState()
  const issues = state.issues
  const teams = state.teams
  
  const team = teams.find((t) => t.id === id)
  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  if (!team) {
    return <div>Team not found</div>
  }

  const teamIssues = useMemo(() => issues.filter((i) => i.teamId === team.id), [issues, team.id])

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
      const issue = issues.find((i) => i.id === issueId)
      if (issue && !issue.labels.includes(labelId)) {
        updateIssue(issueId, { labels: [...issue.labels, labelId] })
      }
    })
  }

  const handleCreateIssue = (status: Issue["status"] = "todo") => {
    const newId = (Math.max(...issues.map(i => parseInt(i.id)), 0) + 1).toString()
    const taskNumbers = issues
      .map(i => {
        const match = i.identifier.match(/TASK-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
    const nextTaskNumber = Math.max(...taskNumbers, 0) + 1
    const newIssue: Issue = {
      id: newId,
      identifier: `TASK-${nextTaskNumber}`,
      title: "New issue",
      description: "",
      status,
      priority: "none",
      assigneeId: null,
      projectId: null,
      teamId: team.id,
      labels: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: null,
      estimate: null,
      createdBy: "1",
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
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{team.icon}</span>
              <Link href={`/team/${team.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {team.name}
              </Link>
            </div>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-lg font-semibold">Issues</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-3">
          {currentView === "list" && (
            <IssueListView 
              issues={teamIssues} 
              onIssueClick={handleIssueClick}
              onDeleteIssues={handleDeleteIssues}
              onMoveToProject={handleMoveToProject}
              onAddLabel={handleAddLabel}
              onCreateIssue={handleCreateIssue}
            />
          )}
          {currentView === "board" && (
            <IssueBoardView 
              issues={teamIssues} 
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
              issues={teamIssues} 
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
    </div>
  )
}
