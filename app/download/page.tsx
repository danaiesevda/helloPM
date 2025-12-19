"use client"

import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Download, Apple, Monitor, Code, Check } from "lucide-react"
import { useState } from "react"

export default function DownloadPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-semibold mb-2">Download Desktop App</h1>
              <p className="text-muted-foreground text-lg">
                Get the full PineApple experience with our native desktop app
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                    <Apple className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">macOS</h3>
                    <p className="text-sm text-muted-foreground">Apple Silicon & Intel</p>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download for macOS
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Requires macOS 11.0 or later</p>
              </div>

              <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Windows</h3>
                    <p className="text-sm text-muted-foreground">Windows 10 & 11</p>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download for Windows
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Requires Windows 10 or later</p>
              </div>

              <div className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Linux</h3>
                    <p className="text-sm text-muted-foreground">AppImage & .deb</p>
                  </div>
                </div>
                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download for Linux
                </Button>
                <p className="text-xs text-muted-foreground mt-2">AppImage works on most distributions</p>
              </div>
            </div>

            <div className="border border-border rounded-lg p-6 bg-muted/30">
              <h2 className="font-semibold mb-4">Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Native performance</p>
                    <p className="text-sm text-muted-foreground">Faster and more responsive than the web app</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Offline support</p>
                    <p className="text-sm text-muted-foreground">Work without an internet connection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">System notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified even when the app is closed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Keyboard shortcuts</p>
                    <p className="text-sm text-muted-foreground">Full keyboard navigation support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}

