"use client"

import { useState, useEffect } from "react"
import { type Issue, mockUsers, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  X,
  MoreHorizontal,
  Circle,
  Clock,
  User,
  Tag,
  Calendar,
  Target,
  Link2,
  Trash2,
  Copy,
  ExternalLink,
  CalendarIcon,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RichTextEditor } from "@/components/rich-text-editor"
import { getLabelIcon } from "@/lib/label-icons"

interface IssueDetailModalProps {
  issue: Issue | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onIssueUpdate?: (issueId: string, updates: Partial<Issue>) => void
}

export function IssueDetailModal({ issue, open, onOpenChange, onIssueUpdate }: IssueDetailModalProps) {
  const { state } = useAppState()
  const availableLabels = state.labels
  
  const [title, setTitle] = useState(issue?.title || "")
  const [description, setDescription] = useState(issue?.description || "")
  const [status, setStatus] = useState(issue?.status || "todo")
  const [priority, setPriority] = useState(issue?.priority || "none")
  const [assigneeId, setAssigneeId] = useState(issue?.assigneeId || "")
  const [projectId, setProjectId] = useState(issue?.projectId || "")
  const [estimate, setEstimate] = useState<string>(issue?.estimate?.toString() || "")
  const [labels, setLabels] = useState<string[]>(issue?.labels || [])
  const [dueDate, setDueDate] = useState<Date | undefined>(issue?.dueDate ? new Date(issue.dueDate) : undefined)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isLabelsOpen, setIsLabelsOpen] = useState(false)
  const [isDueDateOpen, setIsDueDateOpen] = useState(false)

  // Update state when issue changes
  useEffect(() => {
    if (issue) {
      setTitle(issue.title || "")
      setDescription(issue.description || "")
      setStatus(issue.status || "todo")
      setPriority(issue.priority || "none")
      setAssigneeId(issue.assigneeId || "")
      setProjectId(issue.projectId || "")
      setEstimate(issue.estimate?.toString() || "")
      setLabels(issue.labels || [])
      setDueDate(issue.dueDate ? new Date(issue.dueDate) : undefined)
    }
  }, [issue])

  if (!issue) return null

  const assignee = mockUsers.find((u) => u.id === assigneeId)
  const project = mockProjects.find((p) => p.id === projectId)

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

  const priorityConfig = {
    urgent: { label: "Urgent", color: "text-red-500" },
    high: { label: "High", color: "text-orange-500" },
    medium: { label: "Medium", color: "text-yellow-500" },
    low: { label: "Low", color: "text-blue-500" },
    none: { label: "No priority", color: "text-muted-foreground" },
  }

  const statusConfig = {
    backlog: { label: "Backlog", icon: Circle, color: "text-muted-foreground" },
    todo: { label: "Todo", icon: Circle, color: "text-blue-500" },
    "in-progress": { label: "In Progress", icon: Clock, color: "text-yellow-500" },
    done: { label: "Done", icon: Circle, color: "text-green-500" },
    canceled: { label: "Canceled", icon: Circle, color: "text-muted-foreground" },
  }

  const StatusIcon = statusConfig[status as keyof typeof statusConfig].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[95vw] sm:max-w-6xl max-w-[95vw] overflow-hidden p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">
          {issue.identifier} - {title}
        </DialogTitle>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{issue.identifier}</span>
              <Badge variant="secondary" className="gap-1">
                <StatusIcon className={`h-3 w-3 ${statusConfig[status as keyof typeof statusConfig].color}`} />
                {statusConfig[status as keyof typeof statusConfig].label}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy issue link
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link2 className="mr-2 h-4 w-4" />
                    Copy issue ID
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in new tab
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete issue
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Title */}
              {isEditingTitle ? (
                <Textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => {
                    setIsEditingTitle(false)
                    if (title !== issue.title) {
                      onIssueUpdate?.(issue.id, { title })
                    }
                  }}
                  className="mb-4 text-2xl font-semibold resize-none border-none p-0 focus-visible:ring-0"
                  autoFocus
                />
              ) : (
                <h1
                  className="mb-4 text-2xl font-semibold cursor-text hover:bg-accent/50 rounded px-2 py-1 -mx-2"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </h1>
              )}

              {/* Description Editor */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
                <RichTextEditor 
                  value={description} 
                  onChange={(value) => {
                    setDescription(value)
                    onIssueUpdate?.(issue.id, { description: value })
                  }} 
                />
              </div>

              {/* Activity / Comments Section */}
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-medium">Activity</h3>
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="You" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px] resize-none" />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        Cancel
                      </Button>
                      <Button size="sm">Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Properties */}
            <div className="w-96 shrink-0 border-l border-border bg-muted/30 p-4 overflow-y-auto">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Circle className="h-3 w-3" />
                    Status
                  </label>
                  <Select value={status} onValueChange={(value: Issue["status"]) => {
                    setStatus(value)
                    onIssueUpdate?.(issue.id, { status: value })
                  }}>
                    <SelectTrigger 
                      className="h-auto min-h-8 w-full text-sm [&_[data-slot=select-value]]:[display:block] [&_[data-slot=select-value]]:[overflow:visible] [&_[data-slot=select-value]]:[-webkit-line-clamp:unset] [&_[data-slot=select-value]]:whitespace-normal"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start" sideOffset={4}>
                      {Object.entries(statusConfig).map(([key, config]) => {
                        const IconComponent = config.icon
                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <IconComponent className={`h-3 w-3 ${config.color}`} />
                              {config.label}
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Target className="h-3 w-3" />
                    Priority
                  </label>
                  <Select value={priority} onValueChange={(value: Issue["priority"]) => {
                    setPriority(value)
                    onIssueUpdate?.(issue.id, { priority: value })
                  }}>
                    <SelectTrigger 
                      className="h-auto min-h-8 w-full text-sm [&_[data-slot=select-value]]:[display:block] [&_[data-slot=select-value]]:[overflow:visible] [&_[data-slot=select-value]]:[-webkit-line-clamp:unset] [&_[data-slot=select-value]]:whitespace-normal"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start" sideOffset={4}>
                      {Object.entries(priorityConfig).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            {getPriorityIcon(key as Issue["priority"])}
                            <span>{config.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <User className="h-3 w-3" />
                    Assignee
                  </label>
                  <Select value={assigneeId || "unassigned"} onValueChange={(value) => {
                    const newAssigneeId = value === "unassigned" ? null : value
                    setAssigneeId(newAssigneeId || "")
                    onIssueUpdate?.(issue.id, { assigneeId: newAssigneeId })
                  }}>
                    <SelectTrigger 
                      className="h-auto min-h-8 w-full text-sm [&_[data-slot=select-value]]:[display:block] [&_[data-slot=select-value]]:[overflow:visible] [&_[data-slot=select-value]]:[-webkit-line-clamp:unset] [&_[data-slot=select-value]]:whitespace-normal"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start" sideOffset={4}>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                              <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {user.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Labels */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Tag className="h-3 w-3" />
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {labels.map((labelId) => {
                      const label = availableLabels.find((l) => l.id === labelId)
                      if (!label) return null
                      return (
                        <Badge
                          key={label.id}
                          variant="secondary"
                          className="text-xs cursor-pointer hover:opacity-80 gap-1"
                          style={{ backgroundColor: `${label.color}20`, color: label.color }}
                          onClick={() => {
                            const newLabels = labels.filter((id) => id !== labelId)
                            setLabels(newLabels)
                            onIssueUpdate?.(issue.id, { labels: newLabels })
                          }}
                        >
                          {getLabelIcon(label.name)}
                          {label.name}
                          <X className="ml-0.5 h-3 w-3" />
                        </Badge>
                      )
                    })}
                    <Popover open={isLabelsOpen} onOpenChange={setIsLabelsOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          + Add
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2" side="left" align="start">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Select labels</p>
                          {availableLabels.map((label) => {
                            const isSelected = labels.includes(label.id)
                            return (
                              <div
                                key={label.id}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent cursor-pointer"
                                onClick={() => {
                                  const newLabels = isSelected
                                    ? labels.filter((id) => id !== label.id)
                                    : [...labels, label.id]
                                  setLabels(newLabels)
                                  onIssueUpdate?.(issue.id, { labels: newLabels })
                                }}
                              >
                                <Checkbox checked={isSelected} />
                                <span style={{ color: label.color }}>
                                  {getLabelIcon(label.name)}
                                </span>
                                <span className="text-sm">{label.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Target className="h-3 w-3" />
                    Project
                  </label>
                  <Select 
                    value={projectId || "no-project"} 
                    onValueChange={(value) => {
                      const newProjectId = value === "no-project" ? null : value
                      setProjectId(newProjectId || "")
                      onIssueUpdate?.(issue.id, { projectId: newProjectId })
                    }}
                  >
                    <SelectTrigger 
                      className="h-auto min-h-8 w-full text-sm [&_[data-slot=select-value]]:[display:block] [&_[data-slot=select-value]]:[overflow:visible] [&_[data-slot=select-value]]:[-webkit-line-clamp:unset] [&_[data-slot=select-value]]:whitespace-normal"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start" sideOffset={4}>
                      <SelectItem value="no-project">
                        <span className="text-muted-foreground">No project</span>
                      </SelectItem>
                      {mockProjects.map((proj) => (
                        <SelectItem key={proj.id} value={proj.id}>
                          <div className="flex items-center gap-2">
                            <span>{proj.icon}</span>
                            <span>{proj.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Due date
                  </label>
                  <Popover open={isDueDateOpen} onOpenChange={setIsDueDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 w-full justify-start text-sm bg-transparent whitespace-normal text-left gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {dueDate ? dueDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "No due date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" side="left" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => {
                          setDueDate(date)
                          onIssueUpdate?.(issue.id, { dueDate: date ? date.toISOString() : null })
                          setIsDueDateOpen(false)
                        }}
                        initialFocus
                      />
                      {dueDate && (
                        <div className="border-t p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-destructive hover:text-destructive"
                            onClick={() => {
                              setDueDate(undefined)
                              onIssueUpdate?.(issue.id, { dueDate: null })
                              setIsDueDateOpen(false)
                            }}
                          >
                            Clear due date
                          </Button>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Estimate */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    Estimate
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="h-8 w-full rounded-md border border-border bg-background px-2 text-sm"
                      value={estimate}
                      onChange={(e) => setEstimate(e.target.value)}
                      placeholder="0"
                    />
                    <span className="text-xs text-muted-foreground">pts</span>
                  </div>
                </div>

                {/* Created */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs text-muted-foreground break-words">
                    Created {new Date(issue.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-xs text-muted-foreground break-words">
                    Updated {new Date(issue.updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
