"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { 
  Upload, 
  ArrowRight, 
  ExternalLink,
  Users,
  Github,
  FileText,
  ChevronRight,
  Download,
  Layers,
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Custom icons for services
const AsanaIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M18.78 12.653c-2.228 0-4.034 1.806-4.034 4.034s1.806 4.034 4.034 4.034 4.034-1.806 4.034-4.034-1.806-4.034-4.034-4.034zm-13.56 0c-2.228 0-4.034 1.806-4.034 4.034s1.806 4.034 4.034 4.034 4.034-1.806 4.034-4.034-1.806-4.034-4.034-4.034zm6.78-9.374c-2.228 0-4.034 1.806-4.034 4.034s1.806 4.034 4.034 4.034 4.034-1.806 4.034-4.034-1.806-4.034-4.034-4.034z"/>
  </svg>
)

const ShortcutIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
  </svg>
)

const JiraIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.7c0 2.4 1.94 4.34 4.34 4.35V2.84a.84.84 0 0 0-.84-.84H11.53zM6.77 6.8a4.36 4.36 0 0 0 4.34 4.34h1.8v1.72a4.36 4.36 0 0 0 4.34 4.34V7.63a.84.84 0 0 0-.83-.83H6.77zM2 11.6c0 2.4 1.95 4.34 4.35 4.34h1.78v1.72c0 2.4 1.94 4.34 4.34 4.34v-9.57a.84.84 0 0 0-.84-.83H2z"/>
  </svg>
)

const importServices = [
  {
    id: "asana",
    name: "Asana",
    icon: AsanaIcon,
    description: "Import projects and tasks from Asana",
  },
  {
    id: "shortcut",
    name: "Shortcut",
    icon: ShortcutIcon,
    description: "Import stories and epics from Shortcut",
  },
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    description: "Import issues from GitHub repositories",
  },
  {
    id: "jira",
    name: "Jira",
    icon: JiraIcon,
    description: "Import issues and projects from Jira",
  },
]

export default function ImportIssuesPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importUrl, setImportUrl] = useState("")
  const [csvData, setCsvData] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(serviceId)
    setIsImportDialogOpen(true)
  }

  const handleImport = () => {
    // Simulate import
    setIsImportDialogOpen(false)
    setImportUrl("")
    setSelectedService(null)
  }

  const handleExport = () => {
    setIsExporting(true)
    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
      setExportComplete(true)
    }, 2000)
  }

  const selectedServiceData = importServices.find(s => s.id === selectedService)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <Upload className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Import / Export</h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Import Assistant Section */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Import assistant</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you use another service to track issues, this tool will create a copy of them in helloPM.{" "}
                <Link href="#" className="text-primary hover:underline inline-flex items-center gap-1">
                  Docs <ExternalLink className="h-3 w-3" />
                </Link>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {importServices.map((service) => {
                  const IconComponent = service.icon
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceClick(service.id)}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-left transition-colors hover:bg-accent hover:border-primary/50"
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent />
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )
                })}
              </div>

              {/* PineApple to PineApple Import */}
              <div className="mt-4">
                <button
                  onClick={() => {
                    setSelectedService("linear")
                    setIsImportDialogOpen(true)
                  }}
                  className="w-full flex items-center justify-between rounded-lg border border-border bg-background px-4 py-4 text-left transition-colors hover:bg-accent hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-muted-foreground" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-1">
                        helloPM to helloPM import <ChevronRight className="h-4 w-4" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Import data from an existing helloPM workspace
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* CLI Importer Section */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">CLI importer</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you prefer using the command line or want to make custom modifications, use our open
                source importer which imports issues into helloPM from CSV files. It supports Asana (CSV),
                Jira (CSV), GitHub (API), Pivotal Tracker (CSV), Shortcut (CSV), Trello (JSON).
              </p>
              <Link 
                href="https://github.com" 
                target="_blank"
                className="text-primary hover:underline inline-flex items-center gap-1 text-sm font-medium"
              >
                Go to helloPM CLI Importer <ExternalLink className="h-3 w-3" />
              </Link>
            </div>

            {/* Export Section */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-2">Export</h2>
              <p className="text-sm text-muted-foreground mb-4">
                You can export your issue data in CSV format. Once the export is available, we'll email you the
                download link.
              </p>
              <Button 
                onClick={() => setIsExportDialogOpen(true)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedServiceData && <selectedServiceData.icon />}
              Import from {selectedService === "linear" ? "helloPM" : selectedServiceData?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedService === "linear" 
                ? "Enter the workspace URL or export file to import data from another helloPM workspace."
                : `Connect your ${selectedServiceData?.name} account to import issues.`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedService === "github" ? (
              <>
                <div>
                  <label className="text-sm font-medium">Repository URL</label>
                  <Input
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://github.com/username/repository"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">GitHub Token (optional)</label>
                  <Input
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for private repositories
                  </p>
                </div>
              </>
            ) : selectedService === "linear" ? (
              <>
                <div>
                  <label className="text-sm font-medium">Workspace URL or Import File</label>
                  <Input
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://workspace.hellopm.app or upload file"
                    className="mt-1"
                  />
                </div>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 border-border">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">JSON or CSV file</p>
                    </div>
                    <input type="file" className="hidden" accept=".json,.csv" />
                  </label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium">API Key or Token</label>
                  <Input
                    type="password"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder={`Enter your ${selectedServiceData?.name} API key`}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Workspace/Project ID</label>
                  <Input
                    placeholder={`Enter your ${selectedServiceData?.name} workspace ID`}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Start Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Issues</DialogTitle>
            <DialogDescription>
              Export your issues to a CSV file. You can choose what data to include.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!exportComplete ? (
              <>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm">Include all issues</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm">Include comments</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-border" />
                    <span className="text-sm">Include attachments</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Include archived issues</span>
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium">Email for download link</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">Export started!</h3>
                <p className="text-sm text-muted-foreground">
                  We'll send you an email with the download link when your export is ready.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            {!exportComplete ? (
              <>
                <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleExport} disabled={isExporting}>
                  {isExporting ? "Exporting..." : "Export"}
                </Button>
              </>
            ) : (
              <Button onClick={() => {
                setIsExportDialogOpen(false)
                setExportComplete(false)
              }}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}






