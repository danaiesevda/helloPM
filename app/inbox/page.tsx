"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUsers } from "@/lib/mock-data"
import { Archive, CheckCheck, MoreHorizontal, ArchiveRestore, Trash2, Mail, MailOpen } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  type: "mention" | "assigned" | "comment" | "status_change"
  title: string
  description: string
  issueId: string
  actorId: string
  createdAt: string
  read: boolean
  archived: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assigned",
    title: "You were assigned to TASK-6",
    description: "Fix login bug",
    issueId: "6",
    actorId: "2",
    createdAt: "2024-01-16T15:00:00Z",
    read: false,
    archived: false,
  },
  {
    id: "2",
    type: "mention",
    title: "Sarah Chen mentioned you in TASK-5",
    description: "Design new dashboard",
    issueId: "5",
    actorId: "1",
    createdAt: "2024-01-16T14:00:00Z",
    read: false,
    archived: false,
  },
  {
    id: "3",
    type: "comment",
    title: "New comment on TASK-1",
    description: "Get familiar with Linear",
    issueId: "1",
    actorId: "3",
    createdAt: "2024-01-16T12:00:00Z",
    read: true,
    archived: false,
  },
  {
    id: "4",
    type: "status_change",
    title: "TASK-5 status changed to In Progress",
    description: "Design new dashboard",
    issueId: "5",
    actorId: "2",
    createdAt: "2024-01-16T10:00:00Z",
    read: true,
    archived: false,
  },
]

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  const activeNotifications = notifications.filter((n) => !n.archived)
  const unreadNotifications = activeNotifications.filter((n) => !n.read)
  const archivedNotifications = notifications.filter((n) => n.archived)

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    )
  }

  const markAsUnread = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, read: false } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => 
      notification.archived ? notification : { ...notification, read: true }
    ))
  }

  const archiveNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, archived: true, read: true } : notification
      )
    )
  }

  const unarchiveNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId ? { ...notification, archived: false } : notification
      )
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  const archiveAllRead = () => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.read && !notification.archived ? { ...notification, archived: true } : notification
      )
    )
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      mention: "💬",
      assigned: "👤",
      comment: "💭",
      status_change: "🔄",
    }
    return icons[type]
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-semibold shrink-0">Inbox</h1>
            {unreadNotifications.length > 0 && (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {unreadNotifications.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-sm shrink-0 whitespace-nowrap"
              onClick={markAllAsRead}
              disabled={unreadNotifications.length === 0}
            >
              <CheckCheck className="h-4 w-4 shrink-0" />
              Mark all read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 text-sm shrink-0 whitespace-nowrap"
              onClick={archiveAllRead}
              disabled={activeNotifications.filter(n => n.read).length === 0}
            >
              <Archive className="h-4 w-4 shrink-0" />
              Archive read
            </Button>
          </div>
        </header>

        <Tabs defaultValue="unread" className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border px-4">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger value="unread" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                Unread
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{unreadNotifications.length}</span>
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
                All
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{activeNotifications.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Archived
                {archivedNotifications.length > 0 && (
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{archivedNotifications.length}</span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="unread" className="m-0">
              {unreadNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-lg font-medium">All caught up!</p>
                    <p className="text-sm text-muted-foreground">No unread notifications</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {unreadNotifications.map((notification) => {
                    const actor = mockUsers.find((u) => u.id === notification.actorId)

                    return (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className="group flex items-start gap-3 bg-accent/30 p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">{notification.description}</p>
                          {actor && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={actor.avatar || "/placeholder.svg"} alt={actor.name} />
                                <AvatarFallback className="text-xs">{actor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{actor.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation()
                              archiveNotification(notification.id)
                            }}
                            title="Archive"
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <MailOpen className="h-4 w-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all" className="m-0">
              {activeNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No notifications</p>
                  </div>
                </div>
              ) : (
              <div className="divide-y divide-border">
                {activeNotifications.map((notification) => {
                  const actor = mockUsers.find((u) => u.id === notification.actorId)

                  return (
                    <div
                      key={notification.id}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                      className={`group flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors ${
                        !notification.read ? "bg-accent/30 cursor-pointer" : ""
                      }`}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-lg">
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 flex items-start justify-between">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {getRelativeTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="mb-2 text-sm text-muted-foreground">{notification.description}</p>
                        {actor && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={actor.avatar || "/placeholder.svg"} alt={actor.name} />
                              <AvatarFallback className="text-xs">{actor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{actor.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={(e) => {
                            e.stopPropagation()
                            archiveNotification(notification.id)
                          }}
                          title="Archive"
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {notification.read ? (
                              <DropdownMenuItem onClick={() => markAsUnread(notification.id)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Mark as unread
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <MailOpen className="h-4 w-4 mr-2" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteNotification(notification.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  )
                })}
              </div>
              )}
            </TabsContent>

            <TabsContent value="archived" className="m-0">
              {archivedNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center py-12">
                  <div className="text-center">
                    <Archive className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-sm text-muted-foreground">No archived notifications</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {archivedNotifications.map((notification) => {
                    const actor = mockUsers.find((u) => u.id === notification.actorId)

                    return (
                      <div
                        key={notification.id}
                        className="group flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors opacity-70"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-lg">
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                          <div className="mb-1 flex items-start justify-between">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">
                              {getRelativeTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="mb-2 text-sm text-muted-foreground">{notification.description}</p>
                          {actor && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={actor.avatar || "/placeholder.svg"} alt={actor.name} />
                                <AvatarFallback className="text-xs">{actor.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{actor.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => unarchiveNotification(notification.id)}
                            title="Unarchive"
                          >
                            <ArchiveRestore className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => unarchiveNotification(notification.id)}>
                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                Unarchive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
