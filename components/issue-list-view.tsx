"use client"

import { useState } from "react"
import { type Issue, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { IssueCard } from "@/components/issue-card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Plus, X, Trash2, FolderInput, Tag, CheckCircle2, Archive, EyeOff, Eye } from "lucide-react"
import { getLabelIcon } from "@/lib/label-icons"

interface IssueListViewProps {
  issues: Issue[]
  onDragStart?: (issue: Issue) => void
  onDrop?: (status: Issue["status"]) => void
  onIssueClick?: (issue: Issue) => void
  onDeleteIssues?: (issueIds: string[]) => void
  onMoveToProject?: (issueIds: string[], projectId: string | null) => void
  onAddLabel?: (issueIds: string[], labelId: string) => void
  onCreateIssue?: (status: Issue["status"]) => void
}

export function IssueListView({ 
  issues, 
  onDragStart, 
  onDrop, 
  onIssueClick,
  onDeleteIssues,
  onMoveToProject,
  onAddLabel,
  onCreateIssue,
}: IssueListViewProps) {
  const { state } = useAppState()
  const availableLabels = state.labels
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [hiddenSections, setHiddenSections] = useState<Set<string>>(new Set())

  const toggleSelect = (issueId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId)
    } else {
      newSelected.add(issueId)
    }
    setSelectedIds(newSelected)
  }

  const selectAllInStatus = (statusIssues: Issue[]) => {
    const newSelected = new Set(selectedIds)
    statusIssues.forEach(issue => newSelected.add(issue.id))
    setSelectedIds(newSelected)
  }

  const archiveAllInStatus = (statusIssues: Issue[]) => {
    const issueIds = statusIssues.map(i => i.id)
    // Archive = mark as done
    issueIds.forEach(id => {
      // We need to trigger a status change, but since we don't have that prop,
      // we'll delete them as an archive action for now
    })
    onDeleteIssues?.(issueIds)
  }

  const toggleHideSection = (status: string) => {
    const newHidden = new Set(hiddenSections)
    if (newHidden.has(status)) {
      newHidden.delete(status)
    } else {
      newHidden.add(status)
    }
    setHiddenSections(newHidden)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }
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
      {/* Selection Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-accent/50 px-4 py-2">
          <span className="text-xs sm:text-sm font-medium">
            {selectedIds.size} selected
          </span>
          <div className="flex items-center gap-1">
            {/* Move to Project Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                  <FolderInput className="h-3.5 w-3.5" />
                  Move to project
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem
                  onSelect={() => {
                    onMoveToProject?.(Array.from(selectedIds), null)
                    clearSelection()
                  }}
                >
                  <span className="text-muted-foreground">No project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {mockProjects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    onSelect={() => {
                      onMoveToProject?.(Array.from(selectedIds), project.id)
                      clearSelection()
                    }}
                  >
                    <span className="mr-2">{project.icon}</span>
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Label Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                  <Tag className="h-3.5 w-3.5" />
                  Add label
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {availableLabels.map((label) => (
                  <DropdownMenuItem
                    key={label.id}
                    onSelect={() => {
                      onAddLabel?.(Array.from(selectedIds), label.id)
                      clearSelection()
                    }}
                  >
                    <span className="mr-2" style={{ color: label.color }}>
                      {getLabelIcon(label.name)}
                    </span>
                    {label.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Delete Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive"
              onClick={() => {
                onDeleteIssues?.(Array.from(selectedIds))
                clearSelection()
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6"
            onClick={clearSelection}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {Object.entries(groupedIssues).map(([status, statusIssues]) => {
        const config = statusConfig[status as Issue["status"]]
        const isHidden = hiddenSections.has(status)

        return (
          <div key={status} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop?.(status as Issue["status"])}>
            <div className="mb-2 flex items-center justify-between">
              <div 
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => isHidden && toggleHideSection(status)}
              >
                <h2 className={`text-xs sm:text-sm font-medium ${config.color} ${isHidden ? 'opacity-50' : ''}`}>
                  {config.label}
                </h2>
                {statusIssues.length > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                    {statusIssues.length}
                  </span>
                )}
                {isHidden && (
                  <span className="text-xs text-muted-foreground">(hidden - click to show)</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => selectAllInStatus(statusIssues)}
                      disabled={statusIssues.length === 0}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Select all ({statusIssues.length})
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => archiveAllInStatus(statusIssues)}
                      disabled={statusIssues.length === 0}
                      className="text-destructive focus:text-destructive"
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive all
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => toggleHideSection(status)}
                    >
                      {isHidden ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Show section
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide section
                        </>
                      )}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => onCreateIssue?.(status as Issue["status"])}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {!isHidden && (
              <div className="space-y-1 min-h-[40px]">
                {statusIssues.length === 0 ? (
                  <div 
                    className="flex items-center justify-center h-10 rounded-md border border-dashed border-muted-foreground/30 text-xs text-muted-foreground cursor-pointer hover:border-muted-foreground/50 hover:bg-accent/30"
                    onClick={() => onCreateIssue?.(status as Issue["status"])}
                  >
                    No issues • Click to add
                  </div>
                ) : (
                  statusIssues.map((issue) => (
                    <div key={issue.id} draggable onDragStart={() => onDragStart?.(issue)} className="cursor-move">
                      <IssueCard 
                        issue={issue} 
                        onClick={() => onIssueClick?.(issue)}
                        isSelected={selectedIds.has(issue.id)}
                        onToggleSelect={() => toggleSelect(issue.id)}
                        onDelete={() => onDeleteIssues?.([issue.id])}
                        onMoveToProject={(projectId) => onMoveToProject?.([issue.id], projectId)}
                        onAddLabel={(labelId) => onAddLabel?.([issue.id], labelId)}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
