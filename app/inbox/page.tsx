"use client"

import { useState, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/lib/store"
import { type Issue } from "@/lib/mock-data"
import { getLabelIcon } from "@/lib/label-icons"
import { 
  MoreHorizontal, 
  Filter, 
  SlidersHorizontal,
  Circle,
  Star,
  Link2,
  Copy,
  ChevronRight,
  Bell,
  Paperclip,
  ArrowUp,
  Plus,
  Inbox as InboxIcon,
  Minus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InboxNotification {
  id: string
  type: "assigned" | "mentioned" | "commented" | "created"
  issueId: string
  actorId: string
  message: string
  createdAt: string
  read: boolean
}

// Status config - simple colored dots like in the workflow settings
const getStatusConfig = (status: Issue["status"]) => {
  const configs: Record<Issue["status"], { label: string; color: string }> = {
    backlog: { label: "Backlog", color: "#6b7280" },  // gray
    todo: { label: "Todo", color: "#3b82f6" },        // blue
    "in-progress": { label: "In Progress", color: "#eab308" }, // yellow
    done: { label: "Done", color: "#22c55e" },        // green
    canceled: { label: "Canceled", color: "#ef4444" }, // red
  }
  return configs[status]
}

// Priority config - simple colored dots
const getPriorityConfig = (priority: Issue["priority"]) => {
  const configs: Record<Issue["priority"], { label: string; color: string }> = {
    urgent: { label: "Urgent", color: "#ef4444" },    // red
    high: { label: "High", color: "#f97316" },        // orange
    medium: { label: "Medium", color: "#eab308" },    // yellow
    low: { label: "Low", color: "#3b82f6" },          // blue
    none: { label: "No priority", color: "#6b7280" }, // gray
  }
  return configs[priority]
}

// Simple filled circle dot
const StatusIcon = ({ status }: { status: Issue["status"] }) => {
  const config = getStatusConfig(status)
  return (
    <div 
      className="h-2.5 w-2.5 rounded-full" 
      style={{ backgroundColor: config.color }}
    />
  )
}

// Simple filled circle dot for priority
const PriorityIcon = ({ priority }: { priority: Issue["priority"] }) => {
  const config = getPriorityConfig(priority)
  return (
    <div 
      className="h-2.5 w-2.5 rounded-full" 
      style={{ backgroundColor: config.color }}
    />
  )
}

export default function InboxPage() {
  const { state, updateIssue } = useAppState()
  const issues = state.issues
  const users = state.users
  const teams = state.teams
  const labels = state.labels

  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null)
  const [comment, setComment] = useState("")

  // Mock notifications based on issues
  const [notifications, setNotifications] = useState<InboxNotification[]>(() => {
    return issues.slice(0, 5).map((issue, index) => ({
      id: `notif-${index}`,
      type: index === 0 ? "assigned" : index === 1 ? "mentioned" : "created",
      issueId: issue.id,
      actorId: users[index % users.length]?.id || "1",
      message: index === 0 
        ? "assigned the issue to you" 
        : index === 1 
        ? "mentioned you in a comment"
        : "created the issue",
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
      read: index > 0,
    }))
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const selectedNotification = notifications.find(n => n.id === selectedNotificationId)
  const selectedIssue = useMemo(() => 
    selectedNotification 
      ? issues.find(i => i.id === selectedNotification.issueId)
      : null,
    [selectedNotification, issues]
  )
  const selectedActor = selectedNotification
    ? users.find(u => u.id === selectedNotification.actorId)
    : null
  const selectedTeam = selectedIssue
    ? teams.find(t => t.id === selectedIssue.teamId)
    : null

  const handleNotificationClick = (notificationId: string) => {
    setSelectedNotificationId(notificationId)
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const handleStatusChange = (newStatus: Issue["status"]) => {
    if (selectedIssue) {
      updateIssue(selectedIssue.id, { status: newStatus })
    }
  }

  const handlePriorityChange = (newPriority: Issue["priority"]) => {
    if (selectedIssue) {
      updateIssue(selectedIssue.id, { priority: newPriority })
    }
  }

  const handleLabelToggle = (labelId: string) => {
    if (!selectedIssue) return
    const currentLabels = selectedIssue.labels || []
    const newLabels = currentLabels.includes(labelId)
      ? currentLabels.filter(id => id !== labelId)
      : [...currentLabels, labelId]
    updateIssue(selectedIssue.id, { labels: newLabels })
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)

    if (diffMins < 1) return "now"
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    return `${Math.floor(diffHours / 24)}d`
  }

  const getIssueLabels = () => {
    if (!selectedIssue || !selectedIssue.labels) return []
    return selectedIssue.labels.map(labelId => labels.find(l => l.id === labelId)).filter(Boolean)
  }

  const allStatuses: Issue["status"][] = ["backlog", "todo", "in-progress", "done", "canceled"]
  const allPriorities: Issue["priority"][] = ["none", "urgent", "high", "medium", "low"]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Notifications List */}
        <div className="w-[400px] border-r border-border flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Inbox</h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Mark all as read</DropdownMenuItem>
                  <DropdownMenuItem>Archive all</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => {
              const issue = issues.find(i => i.id === notification.issueId)
              const actor = users.find(u => u.id === notification.actorId)
              const team = issue ? teams.find(t => t.id === issue.teamId) : null
              const isSelected = selectedNotificationId === notification.id

              if (!issue) return null

              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-border transition-colors ${
                    isSelected 
                      ? "bg-accent" 
                      : notification.read 
                      ? "hover:bg-accent/50" 
                      : "bg-accent/30 hover:bg-accent/50"
                  }`}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={actor?.avatar || undefined} />
                    <AvatarFallback className="text-xs bg-orange-500 text-white">
                      {actor?.name?.slice(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                      <span className="text-sm font-medium truncate">
                        {team?.identifier || "TASK"}-{issue.id.slice(-1)} {issue.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {actor?.name} {notification.message}
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground shrink-0">
                    {getRelativeTime(notification.createdAt)}
                  </span>
                </div>
              )
            })}

            {notifications.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <InboxIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Issue Details */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedIssue ? (
            <>
              {/* Issue Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                <div className="flex items-center gap-2 text-sm">
                  <span>{selectedTeam?.icon}</span>
                  <span className="text-muted-foreground">{selectedTeam?.name}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedTeam?.identifier || "TASK"}-{selectedIssue.id.slice(-1)}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Star className="h-3.5 w-3.5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Copy issue ID</DropdownMenuItem>
                      <DropdownMenuItem>Copy issue link</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Link2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Issue Status Bar - Dynamic */}
              <div className="flex items-center gap-2 px-6 py-2 border-b border-border flex-wrap">
                {/* Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      <StatusIcon status={selectedIssue.status} />
                      <span>{getStatusConfig(selectedIssue.status).label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {allStatuses.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                      >
                        <StatusIcon status={status} />
                        <span className="ml-2">{getStatusConfig(status).label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Priority Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      <PriorityIcon priority={selectedIssue.priority} />
                      <span>{getPriorityConfig(selectedIssue.priority).label}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {allPriorities.map((priority) => (
                      <DropdownMenuItem
                        key={priority}
                        onClick={() => handlePriorityChange(priority)}
                      >
                        <PriorityIcon priority={priority} />
                        <span className="ml-2">{getPriorityConfig(priority).label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Assignee */}
                {selectedIssue.assigneeId && (
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-border text-xs">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={users.find(u => u.id === selectedIssue.assigneeId)?.avatar || undefined} />
                      <AvatarFallback className="text-[10px]">
                        {users.find(u => u.id === selectedIssue.assigneeId)?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span>{users.find(u => u.id === selectedIssue.assigneeId)?.name}</span>
                  </div>
                )}

                {/* Labels Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
                      {getIssueLabels().length > 0 ? (
                        <div className="flex items-center gap-1">
                          {getIssueLabels().slice(0, 2).map((label: any) => (
                            <span 
                              key={label.id}
                              className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium"
                              style={{ backgroundColor: `${label.color}20`, color: label.color }}
                            >
                              {getLabelIcon(label.name, "h-3 w-3")}
                              {label.name}
                            </span>
                          ))}
                          {getIssueLabels().length > 2 && (
                            <span className="text-muted-foreground">+{getIssueLabels().length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Add label</span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {labels.map((label) => {
                      const isSelected = selectedIssue.labels?.includes(label.id)
                      return (
                        <DropdownMenuItem
                          key={label.id}
                          onClick={() => handleLabelToggle(label.id)}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className="flex h-6 w-6 items-center justify-center rounded-md"
                              style={{ backgroundColor: `${label.color}20`, color: label.color }}
                            >
                              {getLabelIcon(label.name, "h-3.5 w-3.5")}
                            </div>
                            <span>{label.name}</span>
                          </div>
                          {isSelected && (
                            <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Issue Content */}
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <h1 className="text-2xl font-semibold mb-4">{selectedIssue.title}</h1>
                
                {selectedIssue.description && (
                  <p className="text-muted-foreground mb-6">{selectedIssue.description}</p>
                )}

                {/* Add sub-issues button */}
                <div className="flex items-center gap-2 mb-8">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Plus className="h-4 w-4 mr-1" />
                    Add sub-issues
                  </Button>
                  <div className="flex-1" />
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                {/* Activity Section */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Activity</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Unsubscribe</span>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">You</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Activity Item */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedActor?.avatar || undefined} />
                      <AvatarFallback className="text-xs bg-orange-500 text-white">
                        {selectedActor?.name?.slice(0, 2).toUpperCase() || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-sm">
                        <span className="font-medium">{selectedActor?.name}</span>
                        <span className="text-muted-foreground"> created the issue</span>
                        <span className="text-muted-foreground"> · just now</span>
                      </span>
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div className="rounded-lg border border-border bg-muted/30">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Leave a comment..."
                      className="border-0 bg-transparent resize-none min-h-[80px] focus-visible:ring-0"
                    />
                    <div className="flex items-center justify-end gap-2 p-2 border-t border-border">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button size="icon" className="h-7 w-7" disabled={!comment.trim()}>
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-24 h-24 mb-4 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                <InboxIcon className="h-10 w-10 text-muted-foreground/30" />
              </div>
              <p className="text-sm">{unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}</p>
            </div>
          )}
        </div>
      </div>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
