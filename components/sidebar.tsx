"use client"

import Link from "next/link"
import {
  ChevronDown,
  Inbox,
  ListTodo,
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
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { mockTeams } from "@/lib/mock-data"

interface SidebarProps {
  onSearchClick?: () => void
}

export function Sidebar({ onSearchClick }: SidebarProps) {
  const [selectedTeam, setSelectedTeam] = useState(mockTeams[0].id)
  const [workspaceOpen, setWorkspaceOpen] = useState(true)
  const [teamOpen, setTeamOpen] = useState(true)

  const currentTeam = mockTeams.find((t) => t.id === selectedTeam)

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Workspace Switcher */}
      <div className="flex items-center gap-2 border-b border-sidebar-border px-3 py-3">
        <Button
          variant="ghost"
          className="h-8 flex-1 min-w-0 justify-between px-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
              T
            </div>
            <span className="truncate">Test</span>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={onSearchClick}
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <PenSquare className="h-4 w-4" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {/* Personal Section */}
        <div className="mb-4 space-y-0.5">
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
                href="/settings"
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>
          )}
        </div>

        {/* Team Section */}
        <div className="mb-4">
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex w-full items-center gap-1 px-2 py-1 text-xs font-medium text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <ChevronDown className={cn("h-3 w-3 transition-transform", !teamOpen && "-rotate-90")} />
            <span>Your teams</span>
          </button>
          {teamOpen && (
            <div className="mt-0.5 space-y-0.5">
              {mockTeams.map((team) => (
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
                        className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-1.5 text-sm text-sidebar-accent-foreground"
                      >
                        <ListTodo className="h-4 w-4" />
                        <span>Issues</span>
                      </Link>
                      <Link
                        href={`/team/${team.id}/projects`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                      >
                        <FolderKanban className="h-4 w-4" />
                        <span>Projects</span>
                      </Link>
                      <Link
                        href={`/team/${team.id}/views`}
                        className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
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
            <Link
              href="/invite-people"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite people</span>
            </Link>
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
    </aside>
  )
}
