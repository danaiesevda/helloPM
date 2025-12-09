"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
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
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground mb-4">Workspace</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Workspace name</label>
                    <input
                      type="text"
                      defaultValue="Test"
                      className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Workspace URL</label>
                    <input
                      type="text"
                      defaultValue="test.linear.app"
                      className="mt-1 w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h2 className="text-base font-semibold text-foreground mb-4">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Theme</div>
                      <div className="text-sm text-muted-foreground">Choose your interface theme</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={mounted && theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className="h-9 w-9 p-0"
                        title="Light"
                      >
                        <Sun className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={mounted && theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className="h-9 w-9 p-0"
                        title="Dark"
                      >
                        <Moon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={mounted && theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                        className="h-9 w-9 p-0"
                        title="System"
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-foreground">Notifications</div>
                      <div className="text-sm text-muted-foreground">Receive email notifications</div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
