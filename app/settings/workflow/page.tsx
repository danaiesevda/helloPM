"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Workflow, CheckCircle2 } from "lucide-react"
import { mockStatuses } from "@/lib/mock-data"

export default function WorkflowSettingsPage() {
  const [autoAssign, setAutoAssign] = useState(false)
  const [autoArchive, setAutoArchive] = useState(true)
  const [notifyOnStatusChange, setNotifyOnStatusChange] = useState(true)

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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
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
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Workflow Automation</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Auto-assign issues</div>
                      <div className="text-sm text-muted-foreground">Automatically assign issues to team members</div>
                    </div>
                    <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Auto-archive completed</div>
                      <div className="text-sm text-muted-foreground">Automatically archive issues when marked as done</div>
                    </div>
                    <Switch checked={autoArchive} onCheckedChange={setAutoArchive} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Notify on status change</div>
                      <div className="text-sm text-muted-foreground">Send notifications when issue status changes</div>
                    </div>
                    <Switch checked={notifyOnStatusChange} onCheckedChange={setNotifyOnStatusChange} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h2 className="text-base font-semibold text-foreground mb-4">Issue Statuses</h2>
                <div className="space-y-3">
                  {mockStatuses.map((status) => {
                    const getStatusColor = (type: string) => {
                      switch (type) {
                        case "backlog":
                          return "bg-muted-foreground"
                        case "unstarted":
                          return "bg-blue-500"
                        case "started":
                          return "bg-yellow-500"
                        case "completed":
                          return "bg-green-500"
                        case "canceled":
                          return "bg-red-500"
                        default:
                          return "bg-primary"
                      }
                    }

                    return (
                      <div
                        key={status.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(status.type)}`} />
                          <div>
                            <div className="text-sm font-medium text-foreground capitalize">{status.name}</div>
                            <div className="text-xs text-muted-foreground capitalize">{status.type}</div>
                          </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button>
                  Save changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

