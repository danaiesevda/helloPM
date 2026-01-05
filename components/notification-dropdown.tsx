"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Bell } from "lucide-react"
import { useAppState } from "@/lib/store"
import { type Issue } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Notification {
  id: string
  type: "assigned" | "mentioned" | "commented" | "created"
  issueId: string
  actorId: string
  message: string
  createdAt: string
  read: boolean
}

export function NotificationDropdown() {
  const { state } = useAppState()
  const issues = state.issues
  const users = state.users

  // Generate notifications from issues
  const notifications = useMemo<Notification[]>(() => {
    return issues.slice(0, 8).map((issue, index) => ({
      id: `notif-${index}`,
      type: index === 0 ? "assigned" : index === 1 ? "mentioned" : index === 2 ? "commented" : "created",
      issueId: issue.id,
      actorId: users[index % users.length]?.id || "1",
      message: index === 0 
        ? "assigned the issue to you" 
        : index === 1 
        ? "mentioned you in a comment"
        : index === 2
        ? "commented on the issue"
        : "created the issue",
      createdAt: new Date(Date.now() - index * 3600000).toISOString(),
      read: index > 2,
    }))
  }, [issues, users])

  const unreadCount = notifications.filter(n => !n.read).length

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return then.toLocaleDateString()
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assigned":
        return "👤"
      case "mentioned":
        return "💬"
      case "commented":
        return "💭"
      case "created":
        return "✨"
      default:
        return "🔔"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[500px] overflow-y-auto">
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-sm font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((notification) => {
              const issue = issues.find(i => i.id === notification.issueId)
              const actor = users.find(u => u.id === notification.actorId)
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 px-3 py-3 cursor-pointer"
                  asChild
                >
                  <Link href="/inbox" className="w-full">
                    <div className="flex items-start gap-3 w-full">
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={actor?.avatar || "/placeholder.svg"} alt={actor?.name || "User"} />
                        <AvatarFallback className="text-xs">
                          {actor?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{getNotificationIcon(notification.type)}</span>
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {actor?.name || "Someone"} {notification.message}
                          </p>
                        </div>
                        {issue && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {issue.identifier}: {issue.title}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {getRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/inbox" className="w-full text-center justify-center">
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
