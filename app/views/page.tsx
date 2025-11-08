"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Settings, MoreHorizontal, Star, LayoutGrid } from "lucide-react"

const mockViews = [
  {
    id: "1",
    name: "My active issues",
    description: "Issues assigned to me that are not done",
    icon: "🎯",
    filters: { status: ["todo", "in-progress"], assignee: ["me"] },
    favorite: true,
  },
  {
    id: "2",
    name: "High priority",
    description: "All high and urgent priority issues",
    icon: "🔥",
    filters: { priority: ["urgent", "high"] },
    favorite: true,
  },
  {
    id: "3",
    name: "Overdue",
    description: "Issues past their due date",
    icon: "⏰",
    filters: { overdue: true },
    favorite: false,
  },
  {
    id: "4",
    name: "No assignee",
    description: "Unassigned issues",
    icon: "👤",
    filters: { assignee: ["unassigned"] },
    favorite: false,
  },
]

export default function ViewsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Views</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-4 w-4" />
              <span>New view</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Favorites</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {mockViews
                .filter((view) => view.favorite)
                .map((view) => (
                  <div
                    key={view.id}
                    className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                          {view.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{view.name}</h3>
                          <p className="text-sm text-muted-foreground">{view.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(view.filters).length} filters applied
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">All Views</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {mockViews
                .filter((view) => !view.favorite)
                .map((view) => (
                  <div
                    key={view.id}
                    className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-2xl">
                          {view.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{view.name}</h3>
                          <p className="text-sm text-muted-foreground">{view.description}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                        <Star className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(view.filters).length} filters applied
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
