"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { mockTeams, mockIssues, type Issue } from "@/lib/mock-data"
import { Filter, Plus, Settings } from "lucide-react"
import { IssueListView } from "@/components/issue-list-view"
import { IssueBoardView } from "@/components/issue-board-view"
import { IssueTableView } from "@/components/issue-table-view"
import { IssueDetailModal } from "@/components/issue-detail-modal"
import { ViewSwitcher, type ViewType } from "@/components/view-switcher"
import Link from "next/link"

export default function TeamIssuesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const team = mockTeams.find((t) => t.id === id)
  const [currentView, setCurrentView] = useState<ViewType>("list")
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!team) {
    return <div>Team not found</div>
  }

  const teamIssues = mockIssues.filter((i) => i.teamId === team.id)

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

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
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-4 w-4" />
              New issue
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-auto px-4 py-3">
          {currentView === "list" && <IssueListView issues={teamIssues} onIssueClick={handleIssueClick} />}
          {currentView === "board" && <IssueBoardView issues={teamIssues} onIssueClick={handleIssueClick} />}
          {currentView === "table" && <IssueTableView issues={teamIssues} onIssueClick={handleIssueClick} />}
        </div>
      </main>

      <IssueDetailModal issue={selectedIssue} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
