"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { mockUsers, mockIssues, mockProjects } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { UserPlus, MoreHorizontal, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { state } = useAppState()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const team = state.teams.find((t) => t.id === id)

  if (!team) {
    return <div>Team not found</div>
  }

  const teamIssues = mockIssues.filter((i) => i.teamId === team.id)
  const teamProjects = mockProjects.filter((p) => p.teamId === team.id)

  const stats = {
    totalIssues: teamIssues.length,
    completedIssues: teamIssues.filter((i) => i.status === "done").length,
    inProgressIssues: teamIssues.filter((i) => i.status === "in-progress").length,
    activeProjects: teamProjects.filter((p) => p.status === "active").length,
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border px-4 py-4">
          <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                {team.icon}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold">{team.name}</h1>
                <p className="text-sm text-muted-foreground">{team.key}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 bg-transparent">
                <UserPlus className="h-4 w-4" />
                Invite
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="mb-1 text-xs text-muted-foreground">Total Issues</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats.totalIssues}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="mb-1 text-xs text-muted-foreground">In Progress</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats.inProgressIssues}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="mb-1 text-xs text-muted-foreground">Completed</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats.completedIssues}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="mb-1 text-xs text-muted-foreground">Active Projects</p>
              <p className="text-xl sm:text-2xl font-semibold">{stats.activeProjects}</p>
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border px-4">
            <TabsList className="h-10 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Members
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">{mockUsers.length}</span>
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto p-6">
            <TabsContent value="overview" className="m-0 space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold">Active Projects</h3>
                <div className="space-y-3">
                  {teamProjects.map((project) => (
                    <div key={project.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl"
                            style={{ backgroundColor: `${project.color}20` }}
                          >
                            {project.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold">{project.name}</h4>
                            <p className="text-sm text-muted-foreground">{project.description}</p>
                          </div>
                        </div>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <p className="mt-2 text-xs text-muted-foreground">{project.progress}% complete</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold">Team Velocity</h3>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Team is completing 12 issues per week on average</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="m-0">
              <div className="space-y-2">
                {mockUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize">
                        {user.role}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="projects" className="m-0">
              <div className="grid gap-4 md:grid-cols-2">
                {teamProjects.map((project) => (
                  <div key={project.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl"
                        style={{ backgroundColor: `${project.color}20` }}
                      >
                        {project.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{project.name}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">{project.progress}% complete</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <p className="text-sm text-muted-foreground">Team settings coming soon...</p>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
