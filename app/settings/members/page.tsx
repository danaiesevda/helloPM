import { mockData } from "@/lib/mock-data"
import { User, Mail, MoreHorizontal } from "lucide-react"

export default function MembersSettingsPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col">
        <div className="border-b border-border px-6 py-4">
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Members</h2>
                  <p className="text-sm text-muted-foreground mt-1">Manage workspace members and their roles</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Invite members
                </button>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Member</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Teams</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockData.users.map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <select className="px-2 py-1 bg-background border border-border rounded text-sm text-foreground">
                            <option>Admin</option>
                            <option>Member</option>
                            <option>Guest</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {mockData.teams
                            .filter((t) => user.teamIds.includes(t.id))
                            .map((t) => t.name)
                            .join(", ")}
                        </td>
                        <td className="px-4 py-3">
                          <button className="p-1 hover:bg-muted rounded">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
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
