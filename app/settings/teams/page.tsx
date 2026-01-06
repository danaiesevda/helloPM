"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Plus, Users, MoreHorizontal, UserPlus, Settings as SettingsIcon, Trash2 } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const teamIcons = ["⚙️", "🎨", "💻", "📊", "🎯", "🚀", "🔧", "📱", "🌐", "🎭"]

export default function TeamsSettingsPage() {
  const { state, addTeam, updateTeam, deleteTeam } = useAppState()
  const teams = state.teams
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAddMembersDialogOpen, setIsAddMembersDialogOpen] = useState<string | null>(null)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamKey, setNewTeamKey] = useState("")
  const [newTeamIcon, setNewTeamIcon] = useState(teamIcons[0])
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [teamSettings, setTeamSettings] = useState<{ name: string; key: string; icon: string } | null>(null)

  const handleCreateTeam = () => {
    if (!newTeamName.trim() || !newTeamKey.trim()) return

    const newTeam = {
      id: String(teams.length + 1),
      name: newTeamName.trim(),
      icon: newTeamIcon,
      key: newTeamKey.trim().toUpperCase(),
      memberCount: 0,
    }

    addTeam(newTeam)
    setNewTeamName("")
    setNewTeamKey("")
    setNewTeamIcon(teamIcons[0])
    setIsCreateDialogOpen(false)
  }

  const handleOpenAddMembers = (teamId: string) => {
    setIsAddMembersDialogOpen(teamId)
    setSelectedMembers([])
  }

  const handleAddMembers = () => {
    if (!isAddMembersDialogOpen || selectedMembers.length === 0) return

    const team = teams.find((t) => t.id === isAddMembersDialogOpen)
    if (team) {
      updateTeam(isAddMembersDialogOpen, { memberCount: team.memberCount + selectedMembers.length })
    }
    setIsAddMembersDialogOpen(null)
    setSelectedMembers([])
  }

  const handleOpenSettings = (team: { id: string; name: string; key: string; icon: string }) => {
    setTeamSettings({ name: team.name, key: team.key, icon: team.icon })
    setIsSettingsDialogOpen(team.id)
  }

  const handleSaveSettings = () => {
    if (!isSettingsDialogOpen || !teamSettings) return

    updateTeam(isSettingsDialogOpen, {
      name: teamSettings.name,
      key: teamSettings.key,
      icon: teamSettings.icon,
    })
    setIsSettingsDialogOpen(null)
    setTeamSettings(null)
  }

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId)
    setIsDeleteDialogOpen(null)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to app
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <nav className="w-64 border-r border-border p-4">
            <div className="space-y-1">
              <a
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                General
              </a>
              <a
                href="/settings/members"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Members
              </a>
              <a
                href="/settings/teams"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
              >
                Teams
              </a>
              <a
                href="/settings/labels"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Labels
              </a>
              <a
                href="/settings/workflow"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Workflow
              </a>
              <a
                href="/settings/integrations"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Integrations
              </a>
            </div>
          </nav>
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Teams</h2>
                  <p className="text-sm text-muted-foreground mt-1">Organize your workspace into teams</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create team
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create team</DialogTitle>
                      <DialogDescription>Add a new team to organize your workspace</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Team name</label>
                        <Input
                          placeholder="e.g., Engineering, Design, Marketing"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTeamName.trim() && newTeamKey.trim()) {
                              handleCreateTeam()
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Team key</label>
                        <Input
                          placeholder="e.g., ENG, DES, MKT"
                          value={newTeamKey}
                          onChange={(e) => setNewTeamKey(e.target.value.toUpperCase().slice(0, 3))}
                          maxLength={3}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newTeamName.trim() && newTeamKey.trim()) {
                              handleCreateTeam()
                            }
                          }}
                        />
                        <p className="text-xs text-muted-foreground mt-1">3 letter code (e.g., ENG)</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                        <div className="flex flex-wrap gap-2">
                          {teamIcons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setNewTeamIcon(icon)}
                              className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                                newTeamIcon === icon
                                  ? "border-foreground scale-110 bg-primary/10"
                                  : "border-border hover:border-foreground/50"
                              }`}
                              aria-label={`Select icon ${icon}`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || !newTeamKey.trim()}>
                        Create team
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                          {team.icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{team.name}</div>
                          <div className="text-xs text-muted-foreground">{team.key}</div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenSettings(team)}>
                            <SettingsIcon className="mr-2 h-4 w-4" />
                            Settings
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenAddMembers(team.id)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add members
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setIsDeleteDialogOpen(team.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{team.memberCount} members</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {teams.length === 0 && (
                <div className="border border-dashed border-border rounded-lg p-12 text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-medium text-foreground mb-1">No teams</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first team to get started</p>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create team</DialogTitle>
                        <DialogDescription>Add a new team to organize your workspace</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Team name</label>
                          <Input
                            placeholder="e.g., Engineering, Design, Marketing"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Team key</label>
                          <Input
                            placeholder="e.g., ENG, DES, MKT"
                            value={newTeamKey}
                            onChange={(e) => setNewTeamKey(e.target.value.toUpperCase().slice(0, 3))}
                            maxLength={3}
                          />
                          <p className="text-xs text-muted-foreground mt-1">3 letter code (e.g., ENG)</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                          <div className="flex flex-wrap gap-2">
                            {teamIcons.map((icon) => (
                              <button
                                key={icon}
                                type="button"
                                onClick={() => setNewTeamIcon(icon)}
                                className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                                  newTeamIcon === icon
                                    ? "border-foreground scale-110 bg-primary/10"
                                    : "border-border hover:border-foreground/50"
                                }`}
                                aria-label={`Select icon ${icon}`}
                              >
                                {icon}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateTeam} disabled={!newTeamName.trim() || !newTeamKey.trim()}>
                          Create team
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Add Members Dialog */}
              {isAddMembersDialogOpen && (
                <Dialog open={!!isAddMembersDialogOpen} onOpenChange={(open) => !open && setIsAddMembersDialogOpen(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add members</DialogTitle>
                      <DialogDescription>Select members to add to this team</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {mockUsers.map((user) => (
                          <label
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(user.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedMembers([...selectedMembers, user.id])
                                } else {
                                  setSelectedMembers(selectedMembers.filter((id) => id !== user.id))
                                }
                              }}
                              className="rounded"
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-foreground">{user.name}</div>
                                <div className="text-xs text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddMembersDialogOpen(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMembers} disabled={selectedMembers.length === 0}>
                        Add {selectedMembers.length > 0 ? `${selectedMembers.length} ` : ""}member{selectedMembers.length !== 1 ? "s" : ""}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Team Settings Dialog */}
              {isSettingsDialogOpen && teamSettings && (
                <Dialog open={!!isSettingsDialogOpen} onOpenChange={(open) => !open && setIsSettingsDialogOpen(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Team settings</DialogTitle>
                      <DialogDescription>Update team name, key, and icon</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Team name</label>
                        <Input
                          value={teamSettings.name}
                          onChange={(e) => setTeamSettings({ ...teamSettings, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Team key</label>
                        <Input
                          value={teamSettings.key}
                          onChange={(e) => setTeamSettings({ ...teamSettings, key: e.target.value.toUpperCase().slice(0, 3) })}
                          maxLength={3}
                        />
                        <p className="text-xs text-muted-foreground mt-1">3 letter code (e.g., ENG)</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Icon</label>
                        <div className="flex flex-wrap gap-2">
                          {teamIcons.map((icon) => (
                            <button
                              key={icon}
                              type="button"
                              onClick={() => setTeamSettings({ ...teamSettings, icon })}
                              className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                                teamSettings.icon === icon
                                  ? "border-foreground scale-110 bg-primary/10"
                                  : "border-border hover:border-foreground/50"
                              }`}
                              aria-label={`Select icon ${icon}`}
                            >
                              {icon}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsSettingsDialogOpen(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveSettings}>
                        Save changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Delete Team Confirmation Dialog */}
              {isDeleteDialogOpen && (
                <Dialog open={!!isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(null)}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete team</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this team? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      {teams.find(t => t.id === isDeleteDialogOpen) && (
                        <p className="text-sm text-foreground">
                          Team: <span className="font-semibold">{teams.find(t => t.id === isDeleteDialogOpen)?.name}</span>
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDeleteDialogOpen(null)}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteTeam(isDeleteDialogOpen!)}
                      >
                        Delete team
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

