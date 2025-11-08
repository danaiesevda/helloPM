"use client"

import type React from "react"

import { type Issue, mockUsers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Plus, Circle, Clock } from "lucide-react"
import { useState } from "react"

interface IssueBoardViewProps {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
  onIssueStatusChange?: (issueId: string, newStatus: Issue["status"]) => void
}

export function IssueBoardView({ issues, onIssueClick, onIssueStatusChange }: IssueBoardViewProps) {
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<Issue["status"] | null>(null)

  const groupedIssues = {
    backlog: issues.filter((i) => i.status === "backlog"),
    todo: issues.filter((i) => i.status === "todo"),
    "in-progress": issues.filter((i) => i.status === "in-progress"),
    done: issues.filter((i) => i.status === "done"),
  }

  const columns: Array<{
    status: Issue["status"]
    label: string
    icon: React.ReactNode
    color: string
  }> = [
    {
      status: "backlog",
      label: "Backlog",
      icon: <Circle className="h-3 w-3" />,
      color: "text-muted-foreground",
    },
    {
      status: "todo",
      label: "Todo",
      icon: <Circle className="h-3 w-3" />,
      color: "text-blue-500",
    },
    {
      status: "in-progress",
      label: "In Progress",
      icon: <Clock className="h-3 w-3" />,
      color: "text-yellow-500",
    },
    {
      status: "done",
      label: "Done",
      icon: <Circle className="h-3 w-3 fill-current" />,
      color: "text-green-500",
    },
  ]

  const handleDragStart = (e: React.DragEvent, issue: Issue) => {
    setDraggedIssue(issue)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", issue.id)
  }

  const handleDragEnd = () => {
    setDraggedIssue(null)
    setDraggedOverColumn(null)
  }

  const handleDragOver = (e: React.DragEvent, status: Issue["status"]) => {
    e.preventDefault()
    setDraggedOverColumn(status)
  }

  const handleDragLeave = () => {
    setDraggedOverColumn(null)
  }

  const handleDrop = (status: Issue["status"]) => {
    if (draggedIssue && draggedIssue.status !== status) {
      onIssueStatusChange?.(draggedIssue.id, status)
    }
    setDraggedIssue(null)
    setDraggedOverColumn(null)
  }

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
    <div className="flex h-full gap-3 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnIssues = groupedIssues[column.status]
        const isOver = draggedOverColumn === column.status

        return (
          <div
            key={column.status}
            className="flex w-80 shrink-0 flex-col"
            onDragOver={(e) => handleDragOver(e, column.status)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(column.status)}
          >
            {/* Column Header */}
            <div className="mb-2 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <div className={column.color}>{column.icon}</div>
                <h3 className="text-sm font-medium">{column.label}</h3>
                <span className="text-xs text-muted-foreground">{columnIssues.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={`flex-1 space-y-2 rounded-lg p-2 transition-colors min-h-[100px] ${
                isOver ? "bg-accent/50 ring-2 ring-primary/20" : "bg-transparent"
              }`}
            >
              {columnIssues.length === 0 && !isOver && (
                <div className="flex h-20 items-center justify-center text-xs text-muted-foreground">
                  Drop issues here
                </div>
              )}
              {columnIssues.map((issue) => {
                const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
                const isDragging = draggedIssue?.id === issue.id

                return (
                  <div
                    key={issue.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, issue)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onIssueClick?.(issue)}
                    className={`group cursor-move rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-sm ${
                      isDragging ? "opacity-50 cursor-grabbing" : "opacity-100"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-sm font-medium leading-tight">{issue.title}</p>
                        <span className="text-xs text-muted-foreground">{issue.identifier}</span>
                      </div>
                      {getPriorityIcon(issue.priority)}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {issue.labels.length > 0 && (
                          <div className="flex gap-1">
                            {issue.labels.map((labelId) => (
                              <div key={labelId} className="h-1.5 w-1.5 rounded-full bg-primary" />
                            ))}
                          </div>
                        )}
                        {issue.estimate && <span className="text-xs text-muted-foreground">{issue.estimate}pt</span>}
                      </div>

                      {assignee && (
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                          <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
