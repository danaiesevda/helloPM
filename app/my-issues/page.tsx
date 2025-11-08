"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { mockIssues, type Issue } from "@/lib/mock-data"
import { Filter, Settings } from "lucide-react"
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

  // Get issues assigned to current user (using first user as example)
  const currentUserId = "1"
  const myIssues = mockIssues.filter((i) => i.assigneeId === currentUserId)
  const createdByMeIssues = mockIssues.filter((i) => i.assigneeId === currentUserId)

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
            <h1 className="text-xl font-semibold">My Issues</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Filter className="h-4 w-4" />
            </Button>
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
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{myIssues.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Created by me
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{createdByMeIssues.length}</span>
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
              {currentView === "list" && <IssueListView issues={myIssues} onIssueClick={handleIssueClick} />}
              {currentView === "board" && <IssueBoardView issues={myIssues} onIssueClick={handleIssueClick} />}
              {currentView === "table" && <IssueTableView issues={myIssues} onIssueClick={handleIssueClick} />}
            </TabsContent>

            <TabsContent value="created" className="m-0">
              {currentView === "list" && <IssueListView issues={createdByMeIssues} onIssueClick={handleIssueClick} />}
              {currentView === "board" && <IssueBoardView issues={createdByMeIssues} onIssueClick={handleIssueClick} />}
              {currentView === "table" && <IssueTableView issues={createdByMeIssues} onIssueClick={handleIssueClick} />}
            </TabsContent>

            <TabsContent value="subscribed" className="m-0">
              <p className="text-sm text-muted-foreground">No subscribed issues yet</p>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <IssueDetailModal issue={selectedIssue} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
