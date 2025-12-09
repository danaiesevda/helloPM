"use client"

import { MoreHorizontal, Circle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Issue, mockUsers } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IssueCardProps {
  issue: Issue
  onClick?: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
}

export function IssueCard({ issue, onClick, isSelected = false, onToggleSelect }: IssueCardProps) {
  const assignee = mockUsers.find((u) => u.id === issue.assigneeId)

  const getPriorityIcon = (priority: Issue["priority"]) => {
    const colors = {
      urgent: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-yellow-500",
      low: "bg-blue-500",
      none: "bg-muted-foreground",
    }
    return <div className={`h-2 w-2 rounded-full ${colors[priority]}`} />
  }

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 hover:bg-accent/50 cursor-pointer ${
        isSelected ? "bg-accent/30 border-primary/50" : ""
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleSelect?.()
        }}
        className="flex items-center justify-center"
      >
        {isSelected ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-xs text-muted-foreground">{issue.identifier}</span>
        <span className="truncate text-sm">{issue.title}</span>
      </div>

      <div className="flex items-center gap-2">
        {getPriorityIcon(issue.priority)}
        {assignee && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
            <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
