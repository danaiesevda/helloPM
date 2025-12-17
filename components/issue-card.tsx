"use client"

import { MoreHorizontal, Circle, CheckCircle2, Trash2, FolderInput, Tag, Copy, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Issue, mockUsers, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { getLabelIcon } from "@/lib/label-icons"

interface IssueCardProps {
  issue: Issue
  onClick?: () => void
  isSelected?: boolean
  onToggleSelect?: () => void
  onDelete?: () => void
  onMoveToProject?: (projectId: string | null) => void
  onAddLabel?: (labelId: string) => void
}

export function IssueCard({ 
  issue, 
  onClick, 
  isSelected = false, 
  onToggleSelect,
  onDelete,
  onMoveToProject,
  onAddLabel,
}: IssueCardProps) {
  const { state } = useAppState()
  const availableLabels = state.labels
  
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
            
            {/* Move to Project Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <FolderInput className="mr-2 h-4 w-4" />
                Move to project
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem onSelect={() => onMoveToProject?.(null)}>
                  <span className="text-muted-foreground">No project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {mockProjects.map((project) => (
                  <DropdownMenuItem 
                    key={project.id} 
                    onSelect={() => onMoveToProject?.(project.id)}
                  >
                    <span className="mr-2">{project.icon}</span>
                    {project.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Add Label Submenu */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Tag className="mr-2 h-4 w-4" />
                Add label
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {availableLabels.map((label) => (
                  <DropdownMenuItem 
                    key={label.id} 
                    onSelect={() => onAddLabel?.(label.id)}
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
              onSelect={() => onDelete?.()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
