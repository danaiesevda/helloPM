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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockData } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { User, Plus, MoreHorizontal, ArrowLeft, Edit, Trash2, UserX } from "lucide-react"

export default function MembersSettingsPage() {
  const { state, addUser, updateUser, deleteUser } = useAppState()
  const members = state.users
  
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("Member")

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    const newMember = {
      id: String(members.length + 1),
      name: inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole.toLowerCase() as "admin" | "member" | "viewer",
      avatar: null,
      teamIds: [],
    }

    addUser(newMember)
    setInviteEmail("")
    setInviteRole("Member")
    setIsInviteDialogOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    deleteUser(memberId)
  }

  const handleChangeRole = (memberId: string, newRole: string) => {
    updateUser(memberId, { role: newRole.toLowerCase() as "admin" | "member" | "viewer" })
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border px-3 sm:px-6 py-3 sm:py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to app
            </Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Settings</h1>
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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
              >
                Members
              </a>
              <a
                href="/settings/teams"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Members</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage workspace members and their roles</p>
                </div>
                <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Invite members
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite member</DialogTitle>
                      <DialogDescription>Send an invitation to join your workspace</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Email address</label>
                        <Input
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && inviteEmail.trim()) {
                              handleInviteMember()
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Admin">Admin</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="Guest">Guest</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleInviteMember} disabled={!inviteEmail.trim()}>
                        Send invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-muted-foreground">Member</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-muted-foreground">Email</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-muted-foreground">Role</th>
                      <th className="text-left px-3 sm:px-4 py-2 sm:py-3 text-xs font-medium text-muted-foreground">Teams</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <Select
                            value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            onValueChange={(value) => handleChangeRole(user.id, value)}
                          >
                            <SelectTrigger className="h-8 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Member">Member</SelectItem>
                              <SelectItem value="Guest">Guest</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3 text-sm text-muted-foreground">
                          {mockData.teams
                            .filter((t) => user.teamIds.includes(t.id))
                            .map((t) => t.name)
                            .join(", ") || "—"}
                        </td>
                        <td className="px-3 sm:px-4 py-2 sm:py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit member
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserX className="mr-2 h-4 w-4" />
                                Remove from workspace
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleRemoveMember(user.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
