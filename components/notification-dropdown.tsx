"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppState } from "@/lib/store"

interface Notification {
  id: string
  type: "assigned" | "mentioned" | "commented" | "created" | "status_changed"
  issueId: string
  issueTitle: string
  actorId: string
  actorName: string
  actorAvatar: string | null
  message: string
  createdAt: string
  read: boolean
}

// Mock notifications - in a real app, this would come from your backend/state
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assigned",
    issueId: "1",
    issueTitle: "Fix login bug",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "assigned you to",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "mentioned",
    issueId: "2",
    issueTitle: "Update dashboard",
    actorId: "2",
    actorName: "Jane Smith",
    actorAvatar: null,
    message: "mentioned you in",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "commented",
    issueId: "3",
    issueTitle: "Design new feature",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "commented on",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "4",
    type: "status_changed",
    issueId: "4",
    issueTitle: "Review PR",
    actorId: "2",
    actorName: "Jane Smith",
    actorAvatar: null,
    message: "changed status of",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "5",
    type: "created",
    issueId: "5",
    issueTitle: "Implement dark mode toggle",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "created",
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    read: false,
  },
  {
    id: "6",
    type: "assigned",
    issueId: "6",
    issueTitle: "Fix responsive layout",
    actorId: "2",
    actorName: "Jane Smith",
    actorAvatar: null,
    message: "assigned you to",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
  },
  {
    id: "7",
    type: "mentioned",
    issueId: "7",
    issueTitle: "Add user authentication",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "mentioned you in",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    read: false,
  },
  {
    id: "8",
    type: "commented",
    issueId: "8",
    issueTitle: "Optimize database queries",
    actorId: "2",
    actorName: "Jane Smith",
    actorAvatar: null,
    message: "commented on",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    read: false,
  },
  {
    id: "9",
    type: "created",
    issueId: "9",
    issueTitle: "Setup CI/CD pipeline",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "created",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: false,
  },
  {
    id: "10",
    type: "status_changed",
    issueId: "10",
    issueTitle: "Refactor API endpoints",
    actorId: "2",
    actorName: "Jane Smith",
    actorAvatar: null,
    message: "changed status of",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: false,
  },
  {
    id: "11",
    type: "assigned",
    issueId: "11",
    issueTitle: "Fix responsive layout issues",
    actorId: "1",
    actorName: "John Doe",
    actorAvatar: null,
    message: "assigned you to",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    read: false,
  },
]

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const { state } = useAppState()
  const router = useRouter()
  
  // Load notifications from localStorage or use mock data
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isHydrated, setIsHydrated] = useState(false)
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("hellopm-notifications")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setNotifications(parsed)
      } catch (e) {
        // If parsing fails, use mock data
        setNotifications(mockNotifications)
      }
    } else {
      // First time - use mock data
      setNotifications(mockNotifications)
    }
    setIsHydrated(true)
  }, [])
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("hellopm-notifications", JSON.stringify(notifications))
    }
  }, [notifications, isHydrated])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string, issueId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
    
    // Navigate to the issue's team page
    const issue = state.issues.find(i => i.id === issueId)
    if (issue) {
      setOpen(false) // Close dropdown
      router.push(`/team/${issue.teamId}/issues`)
    }
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const getActorInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assigned":
        return "👤"
      case "mentioned":
        return "@"
      case "commented":
        return "💬"
      case "created":
        return "✨"
      case "status_changed":
        return "🔄"
      default:
        return "🔔"
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative border-0 hover:border-0 focus:border-0 focus-visible:border-0 ring-0 focus:ring-0 focus-visible:ring-0">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <div className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-blue-500 border-2 border-background" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="px-2 py-8 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => {
              const actor = state.users.find(u => u.id === notification.actorId)
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 px-3 py-3 cursor-pointer"
                  onClick={() => handleMarkAsRead(notification.id, notification.issueId)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={actor?.avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {actor ? getActorInitials(actor.name) : getActorInitials(notification.actorName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? "text-muted-foreground" : "text-foreground font-medium"}`}>
                          <span className="font-semibold">{notification.actorName}</span>{" "}
                          {notification.message}{" "}
                          <span className="font-medium">{notification.issueTitle}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                    </div>
                  </div>
                </DropdownMenuItem>
              )
            })}
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-sm">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
