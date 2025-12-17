"use client"

import type React from "react"

import { type Issue, mockUsers, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Plus, Circle, Clock, CheckCircle2, Archive, Trash2, Copy, Link2, FolderInput, Tag } from "lucide-react"
import { useState } from "react"
import { getLabelIcon } from "@/lib/label-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

interface IssueBoardViewProps {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
  onIssueStatusChange?: (issueId: string, newStatus: Issue["status"]) => void
  onCreateIssue?: (status: Issue["status"]) => void
  onDeleteIssues?: (issueIds: string[]) => void
  onMoveToProject?: (issueIds: string[], projectId: string | null) => void
  onAddLabel?: (issueIds: string[], labelId: string) => void
}

export function IssueBoardView({ 
  issues, 
  onIssueClick, 
  onIssueStatusChange, 
  onCreateIssue,
  onDeleteIssues,
  onMoveToProject,
  onAddLabel,
}: IssueBoardViewProps) {
  const { state } = useAppState()
  const availableLabels = state.labels
  
  const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState<Issue["status"] | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const selectAllInColumn = (columnIssues: Issue[]) => {
    const newSelected = new Set(selectedIds)
    columnIssues.forEach(issue => newSelected.add(issue.id))
    setSelectedIds(newSelected)
  }

  const archiveAllInColumn = (columnIssues: Issue[]) => {
    const issueIds = columnIssues.map(i => i.id)
    onDeleteIssues?.(issueIds)
  }

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
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onCreateIssue?.(column.status)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => selectAllInColumn(columnIssues)}
                      disabled={columnIssues.length === 0}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Select all ({columnIssues.length})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => archiveAllInColumn(columnIssues)}
                      disabled={columnIssues.length === 0}
                      className="text-destructive focus:text-destructive"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive all
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(issue.priority)}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 opacity-0 group-hover:opacity-100"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem
                              onSelect={() => {
                                if (navigator?.clipboard) {
                                  navigator.clipboard.writeText(issue.identifier)
                                }
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => {
                                if (typeof window !== 'undefined' && navigator?.clipboard) {
                                  navigator.clipboard.writeText(`${window.location.origin}/issue/${issue.id}`)
                                }
                              }}
                            >
                              <Link2 className="mr-2 h-4 w-4" />
                              Copy link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <FolderInput className="mr-2 h-4 w-4" />
                                Move to project
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                <DropdownMenuItem onSelect={() => onMoveToProject?.([issue.id], null)}>
                                  <span className="text-muted-foreground">No project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {mockProjects.map((project) => (
                                  <DropdownMenuItem 
                                    key={project.id} 
                                    onSelect={() => onMoveToProject?.([issue.id], project.id)}
                                  >
                                    <span className="mr-2">{project.icon}</span>
                                    {project.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger>
                                <Tag className="mr-2 h-4 w-4" />
                                Add label
                              </DropdownMenuSubTrigger>
                              <DropdownMenuSubContent className="w-48">
                                {availableLabels.map((label) => (
                                  <DropdownMenuItem 
                                    key={label.id} 
                                    onSelect={() => onAddLabel?.([issue.id], label.id)}
                                  >
                                    <span className="mr-2" style={{ color: label.color }}>
                                      {getLabelIcon(label.name)}
                                    </span>
                                    {label.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onSelect={() => onDeleteIssues?.([issue.id])}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {issue.labels.length > 0 && (
                          <div className="flex gap-1">
                            {issue.labels.map((labelId) => {
                              const label = availableLabels.find((l) => l.id === labelId)
                              if (!label) return null
                              return (
                                <span key={labelId} style={{ color: label.color }}>
                                  {getLabelIcon(label.name, "h-3 w-3")}
                                </span>
                              )
                            })}
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
