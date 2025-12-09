"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { mockData } from "@/lib/mock-data"
import { TrendingUp, Clock, Target, Users, ArrowLeft } from "lucide-react"

export default function InsightsPage() {
  const totalIssues = mockData.issues.length
  const completedIssues = mockData.issues.filter((i) => i.status === "done").length
  const inProgressIssues = mockData.issues.filter((i) => i.status === "in-progress").length
  const completionRate = Math.round((completedIssues / totalIssues) * 100)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-start gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to app
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Insights</h1>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Total Issues</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{totalIssues}</div>
                <div className="text-xs text-muted-foreground mt-1">Across all projects</div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Completed</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{completedIssues}</div>
                <div className="text-xs text-green-600 mt-1">{completionRate}% completion rate</div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">In Progress</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{inProgressIssues}</div>
                <div className="text-xs text-muted-foreground mt-1">Currently active</div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Team Members</span>
                </div>
                <div className="text-2xl font-semibold text-foreground">{mockData.users.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Active contributors</div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Status Distribution</h2>
              <div className="space-y-3">
                {mockData.statuses.map((status) => {
                  const count = mockData.issues.filter((i) => i.status === status.id).length
                  const percentage = Math.round((count / totalIssues) * 100)
                  return (
                    <div key={status.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{status.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} issues ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Priority Breakdown</h2>
              <div className="grid grid-cols-4 gap-4">
                {mockData.priorities.map((priority) => {
                  const count = mockData.issues.filter((i) => i.priority === priority.id).length
                  return (
                    <div key={priority.id} className="border border-border rounded-lg p-4">
                      <div className="text-sm text-muted-foreground mb-1">{priority.name}</div>
                      <div className="text-2xl font-semibold text-foreground">{count}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Team Performance */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-base font-semibold text-foreground mb-4">Team Performance</h2>
              <div className="space-y-3">
                {mockData.users.map((user) => {
                  const assignedCount = mockData.issues.filter((i) => i.assigneeId === user.id).length
                  const completedCount = mockData.issues.filter(
                    (i) => i.assigneeId === user.id && i.status === "done",
                  ).length
                  const userCompletion = assignedCount > 0 ? Math.round((completedCount / assignedCount) * 100) : 0

                  return (
                    <div key={user.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-foreground">{user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {completedCount}/{assignedCount} completed ({userCompletion}%)
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-600" style={{ width: `${userCompletion}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
