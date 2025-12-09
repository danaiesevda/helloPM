"use client"

import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LogoutPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    // In a real app, this would clear authentication tokens, etc.
    console.log("Logging out...")
    // Redirect to home or login page
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-12">
          <div className="max-w-md mx-auto">
            <div className="border border-border rounded-lg p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                  <LogOut className="h-8 w-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-semibold mb-2">Log out</h1>
                <p className="text-muted-foreground">
                  Are you sure you want to log out? You'll need to sign in again to access your workspace.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={handleLogout} className="w-full" variant="destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}



