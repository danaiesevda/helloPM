"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, Slack, Figma, Zap, CheckCircle2, ExternalLink } from "lucide-react"

const integrations = [
  {
    id: "github",
    name: "GitHub",
    description: "Sync issues and pull requests",
    icon: Github,
    connected: true,
    color: "#181717",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notifications in Slack channels",
    icon: Slack,
    connected: true,
    color: "#4A154B",
  },
  {
    id: "figma",
    name: "Figma",
    description: "Link design files to issues",
    icon: Figma,
    connected: false,
    color: "#F24E1E",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5000+ apps",
    icon: Zap,
    connected: false,
    color: "#FF4A00",
  },
]

export default function IntegrationsSettingsPage() {
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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                Workflow
              </a>
              <a
                href="/settings/integrations"
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
              >
                Integrations
              </a>
            </div>
          </nav>
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl">
              <div className="mb-6">
                <h2 className="text-base font-semibold text-foreground">Integrations</h2>
                <p className="text-sm text-muted-foreground mt-1">Connect your favorite tools and services</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {integrations.map((integration) => {
                  const Icon = integration.icon
                  return (
                    <div
                      key={integration.id}
                      className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${integration.color}15` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: integration.color }} />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{integration.name}</div>
                            <div className="text-xs text-muted-foreground">{integration.description}</div>
                          </div>
                        </div>
                        {integration.connected && (
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {integration.connected ? (
                          <>
                            <Button variant="outline" size="sm" className="flex-1">
                              Configure
                            </Button>
                            <Button variant="outline" size="sm">
                              Disconnect
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" className="flex-1">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Connect
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 border border-border rounded-lg p-6 bg-muted/30">
                <h3 className="text-sm font-semibold text-foreground mb-2">Need a custom integration?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our API to build custom integrations or connect with tools not listed here.
                </p>
                <Button variant="outline" size="sm">
                  View API Documentation
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



