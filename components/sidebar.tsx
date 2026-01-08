"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ChevronDown,
  Inbox,
  ListTodo,
  FileText,
  FolderKanban,
  LayoutGrid,
  UserPlus,
  Upload,
  Github,
  HelpCircle,
  Search,
  PenSquare,
  BarChart3,
  Calendar,
  Map,
  Settings,
  Plus,
  Download,
  LogOut,
  ChevronRight,
  Users,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useAppState } from "@/lib/store"
import { CreateProjectDialog } from "@/components/create-project-dialog"

interface SidebarProps {
  onSearchClick?: () => void
}

export function Sidebar({ onSearchClick }: SidebarProps) {
  const pathname = usePathname()
  const { state, addUser } = useAppState()
  const teams = state.teams
  const [selectedTeam, setSelectedTeam] = useState("")
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [teamOpen, setTeamOpen] = useState(true)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false)
  const [inviteEmails, setInviteEmails] = useState("")
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Sync selectedTeam with current URL
  useEffect(() => {
    const teamMatch = pathname.match(/^\/team\/([^/]+)/)
    if (teamMatch) {
      const teamId = teamMatch[1]
      if (teams.some(t => t.id === teamId)) {
        setSelectedTeam(teamId)
      }
    }
  }, [pathname, teams])

  const handleSendInvites = () => {
    if (!inviteEmails.trim()) return
    
    // Parse emails (comma or newline separated)
    const emails = inviteEmails
      .split(/[,\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0 && email.includes("@"))
    
    // Add each email as a new user
    emails.forEach((email, index) => {
      const newUser = {
        id: `invited-${Date.now()}-${index}`,
        name: email.split("@")[0],
        email: email,
        role: "member" as const,
        avatar: null,
        teamIds: [],
      }
      addUser(newUser)
    })
    
    setInviteEmails("")
    setIsInviteDialogOpen(false)
  }

  const currentTeam = teams.find((t) => t.id === selectedTeam)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-sidebar transform transition-transform duration-200 ease-in-out",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>
      {/* Workspace Switcher */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 flex-1 justify-between px-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-black">
                  {state.workspace.name.charAt(0).toUpperCase()}
                </div>
                <span>{state.workspace.name}</span>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>G S</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/members" className="flex items-center w-full">
                <UserPlus className="mr-2 h-4 w-4" />
                <span>Invite and manage members</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/download" className="flex items-center w-full">
                <Download className="mr-2 h-4 w-4" />
                <span>Download desktop app</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Switch workspace</span>
                <DropdownMenuShortcut>O W</DropdownMenuShortcut>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-yellow-500 text-xs font-bold text-black">
                      {state.workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{state.workspace.name}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/logout" className="flex items-center w-full">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>Q</DropdownMenuShortcut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onSearchClick}
          >
            <Search className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <PenSquare className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/issues/new" className="flex items-center w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create new issue</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsCreateProjectDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Create new project</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Personal Section */}
        <div className="mb-4 space-y-0.5">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent",
              pathname === "/" && "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            <FileText className="h-4 w-4" />
            <span>All Issues</span>
          </Link>
          <Link
            href="/inbox"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Link>
          <Link
            href="/my-issues"
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ListTodo className="h-4 w-4" />
            <span>My Issues</span>
          </Link>
        </div>

        {/* Workspace Section */}
        <div className="mb-4">
          <button
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", !workspaceOpen && "-rotate-90")} />
            <span>Workspace</span>
          </button>
          {workspaceOpen && (
            <div className="mt-0.5 space-y-0.5">
              <Link
                href="/projects"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <FolderKanban className="h-4 w-4" />
                <span>Projects</span>
              </Link>
              <Link
                href="/roadmap"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Map className="h-4 w-4" />
                <span>Roadmap</span>
              </Link>
              <Link
                href="/cycles"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Calendar className="h-4 w-4" />
                <span>Cycles</span>
              </Link>
              <Link
                href="/insights"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Insights</span>
              </Link>
              <Link
                href="/views"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>Views</span>
              </Link>
              <Link
                href="/settings/teams"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Users className="h-4 w-4" />
                <span>Teams</span>
              </Link>
              <Link
                href="/settings/members"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <UserPlus className="h-4 w-4" />
                <span>Members</span>
              </Link>
            </div>
          )}
        </div>

        {/* Team Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 py-1">
            <button
              onClick={() => setTeamOpen(!teamOpen)}
              className="flex items-center gap-1 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground"
            >
              <ChevronDown className={cn("h-3 w-3 transition-transform", !teamOpen && "-rotate-90")} />
              <span>Your teams</span>
            </button>
            <Link
              href="/settings/teams"
              className="rounded p-0.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              title="Add new team"
            >
              <Plus className="h-3.5 w-3.5" />
            </Link>
          </div>
          {teamOpen && (
            <div className="mt-0.5 space-y-0.5">
              {teams.map((team) => (
                <div key={team.id}>
                  <button
                    onClick={() => setSelectedTeam(team.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent",
                      selectedTeam === team.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground",
                    )}
                  >
                    <span className="text-base">{team.icon}</span>
                    <span>{team.name}</span>
                    <ChevronDown className="ml-auto h-3 w-3" />
                  </button>
                  {selectedTeam === team.id && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-2">
                      <Link
                        href={`/team/${team.id}/issues`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                          pathname === `/team/${team.id}/issues`
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <ListTodo className="h-4 w-4" />
                        <span>Issues</span>
                      </Link>
                      <Link
                        href={`/team/${team.id}/projects`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                          pathname === `/team/${team.id}/projects`
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <FolderKanban className="h-4 w-4" />
                        <span>Projects</span>
                      </Link>
                      <Link
                        href={`/team/${team.id}/views`}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                          pathname === `/team/${team.id}/views`
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <LayoutGrid className="h-4 w-4" />
                        <span>Views</span>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Try Section */}
        <div>
          <button className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <span>Try</span>
          </button>
          <div className="mt-0.5 space-y-0.5">
            <Link
              href="/import-issues"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Upload className="h-4 w-4" />
              <span>Import issues</span>
            </Link>
            <button
              onClick={() => setIsInviteDialogOpen(true)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite people</span>
            </button>
            <Link
              href="/link-github"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Github className="h-4 w-4" />
              <span>Link GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Help Icon */}
      <div className="border-t border-sidebar-border p-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Invite People Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-500 text-black text-xs font-bold">
                {state.workspace.name.charAt(0).toUpperCase()}
              </div>
              Invite to {state.workspace.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Textarea
                value={inviteEmails}
                onChange={(e) => setInviteEmails(e.target.value)}
                placeholder="email@example.com, email2@example.com..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSendInvites} disabled={!inviteEmails.trim()}>
              Send invites
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Project Dialog */}
      <CreateProjectDialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen} />
    </aside>
    </>
  )
}
