"use client"

import { useState } from "react"
import { type Issue, mockUsers, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, X, Trash2, FolderInput, Tag, Plus, Copy, Link2 } from "lucide-react"
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { getLabelIcon } from "@/lib/label-icons"

interface IssueTableViewProps {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
  onDeleteIssues?: (issueIds: string[]) => void
  onMoveToProject?: (issueIds: string[], projectId: string | null) => void
  onAddLabel?: (issueIds: string[], labelId: string) => void
  onCreateIssue?: (status: Issue["status"]) => void
}

export function IssueTableView({ 
  issues, 
  onIssueClick,
  onDeleteIssues,
  onMoveToProject,
  onAddLabel,
  onCreateIssue,
}: IssueTableViewProps) {
  const { state } = useAppState()
  const availableLabels = state.labels
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const allSelected = issues.length > 0 && selectedIds.size === issues.length
  const someSelected = selectedIds.size > 0 && selectedIds.size < issues.length

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(issues.map((issue) => issue.id)))
    }
  }

  const toggleSelect = (issueId: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId)
    } else {
      newSelected.add(issueId)
    }
    setSelectedIds(newSelected)
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
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

  const statusLabels = {
    backlog: "Backlog",
    todo: "Todo",
    "in-progress": "In Progress",
    done: "Done",
    canceled: "Canceled",
  }

  const statusColors = {
    backlog: "bg-muted text-muted-foreground",
    todo: "bg-blue-500/10 text-blue-500",
    "in-progress": "bg-yellow-500/10 text-yellow-500",
    done: "bg-green-500/10 text-green-500",
    canceled: "bg-muted text-muted-foreground",
  }

  return (
    <div className="overflow-x-auto">
      {/* Selection Action Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 border-b border-border bg-accent/50 px-4 py-2">
          <span className="text-sm font-medium">
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

      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="w-10 py-2 pl-4 pr-3">
              <Checkbox
                checked={someSelected ? "indeterminate" : allSelected}
                onCheckedChange={toggleSelectAll}
              />
            </th>
            <th className="w-24 py-2 pl-2">ID</th>
            <th className="min-w-[300px] py-2">Title</th>
            <th className="w-32 py-2">Status</th>
            <th className="w-24 py-2">Priority</th>
            <th className="w-32 py-2">Assignee</th>
            <th className="w-40 py-2">Project</th>
            <th className="w-20 py-2 text-center">Est.</th>
            <th className="w-8 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
            const project = mockProjects.find((p) => p.id === issue.projectId)
            const isSelected = selectedIds.has(issue.id)

            return (
              <tr
                key={issue.id}
                onClick={() => onIssueClick?.(issue)}
                className={`group cursor-pointer border-b border-border hover:bg-accent/50 ${
                  isSelected ? "bg-accent/30" : ""
                }`}
              >
                <td className="py-2 pl-4 pr-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelect(issue.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="py-2 pl-2">
                  <span className="text-xs text-muted-foreground">{issue.identifier}</span>
                </td>
                <td className="py-2">
                  <span className="text-sm">{issue.title}</span>
                </td>
                <td className="py-2">
                  <Badge variant="secondary" className={`${statusColors[issue.status]} border-none`}>
                    {statusLabels[issue.status]}
                  </Badge>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(issue.priority)}
                    <span className="text-xs capitalize text-muted-foreground">{issue.priority}</span>
                  </div>
                </td>
                <td className="py-2">
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                        <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignee.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {project && (
                    <div className="flex items-center gap-2">
                      <span>{project.icon}</span>
                      <span className="text-sm">{project.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-2 text-center">
                  {issue.estimate && <span className="text-xs text-muted-foreground">{issue.estimate}</span>}
                </td>
                <td className="py-2 pr-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
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
                          {mockProjects.map((proj) => (
                            <DropdownMenuItem 
                              key={proj.id} 
                              onSelect={() => onMoveToProject?.([issue.id], proj.id)}
                            >
                              <span className="mr-2">{proj.icon}</span>
                              {proj.name}
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
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Add new issue row */}
      <div 
        className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-accent/50 cursor-pointer border-b border-border"
        onClick={() => onCreateIssue?.("todo")}
      >
        <Plus className="h-4 w-4" />
        <span>Add issue</span>
      </div>
    </div>
  )
}
