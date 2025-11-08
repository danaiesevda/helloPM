"use client"

import type { Issue } from "@/lib/mock-data"
import { IssueCard } from "@/components/issue-card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Plus } from "lucide-react"

interface IssueListViewProps {
  issues: Issue[]
  onDragStart?: (issue: Issue) => void
  onDrop?: (status: Issue["status"]) => void
  onIssueClick?: (issue: Issue) => void
}

export function IssueListView({ issues, onDragStart, onDrop, onIssueClick }: IssueListViewProps) {
  const groupedIssues = {
    backlog: issues.filter((i) => i.status === "backlog"),
    todo: issues.filter((i) => i.status === "todo"),
    "in-progress": issues.filter((i) => i.status === "in-progress"),
    done: issues.filter((i) => i.status === "done"),
    canceled: issues.filter((i) => i.status === "canceled"),
  }

  const statusConfig = {
    backlog: { label: "Backlog", color: "text-muted-foreground" },
    todo: { label: "Todo", color: "text-muted-foreground" },
    "in-progress": { label: "In Progress", color: "text-yellow-500" },
    done: { label: "Done", color: "text-green-500" },
    canceled: { label: "Canceled", color: "text-muted-foreground" },
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedIssues).map(([status, statusIssues]) => {
        if (statusIssues.length === 0) return null
        const config = statusConfig[status as Issue["status"]]

        return (
          <div key={status} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop?.(status as Issue["status"])}>
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-medium ${config.color}`}>{config.label}</h2>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                  {statusIssues.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              {statusIssues.map((issue) => (
                <div key={issue.id} draggable onDragStart={() => onDragStart?.(issue)} className="cursor-move">
                  <IssueCard issue={issue} onClick={() => onIssueClick?.(issue)} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
