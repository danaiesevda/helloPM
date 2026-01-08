"use client"

import { use, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAppState } from "@/lib/store"
import Link from "next/link"
import { Plus, MoreHorizontal, Star, LayoutGrid, Trash2, Edit2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface View {
  id: string
  name: string
  description: string
  icon: string
  filters: Record<string, unknown>
  favorite: boolean
}

const initialViews: View[] = [
  {
    id: "1",
    name: "Active issues",
    description: "All active issues for this team",
    icon: "🎯",
    filters: { status: ["todo", "in-progress"] },
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
    name: "Backlog",
    description: "Issues in backlog",
    icon: "📋",
    filters: { status: ["backlog"] },
    favorite: false,
  },
  {
    id: "4",
    name: "Completed",
    description: "Recently completed issues",
    icon: "✅",
    filters: { status: ["done"] },
    favorite: false,
  },
]

const viewIcons = ["🎯", "🔥", "⏰", "👤", "📋", "✅", "🚀", "💡", "🐛", "⭐", "📊", "🔍"]

export default function TeamViewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { state } = useAppState()
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [views, setViews] = useState<View[]>(initialViews)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingView, setEditingView] = useState<View | null>(null)
  const [newViewName, setNewViewName] = useState("")
  const [newViewDescription, setNewViewDescription] = useState("")
  const [newViewIcon, setNewViewIcon] = useState(viewIcons[0])
  
  const team = state.teams.find((t) => t.id === id)

  if (!team) {
    return <div>Team not found</div>
  }

  const handleCreateView = () => {
    if (!newViewName.trim()) return
    
    const newView: View = {
      id: (Math.max(...views.map(v => parseInt(v.id)), 0) + 1).toString(),
      name: newViewName,
      description: newViewDescription,
      icon: newViewIcon,
      filters: {},
      favorite: false,
    }
    
    setViews([...views, newView])
    setNewViewName("")
    setNewViewDescription("")
    setNewViewIcon(viewIcons[0])
    setIsCreateDialogOpen(false)
  }

  const handleEditView = () => {
    if (!editingView || !editingView.name.trim()) return
    
    setViews(views.map(v => v.id === editingView.id ? editingView : v))
    setEditingView(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteView = (viewId: string) => {
    setViews(views.filter(v => v.id !== viewId))
  }

  const handleToggleFavorite = (viewId: string) => {
    setViews(views.map(v => v.id === viewId ? { ...v, favorite: !v.favorite } : v))
  }

  const openEditDialog = (view: View) => {
    setEditingView({ ...view })
    setIsEditDialogOpen(true)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">{team.icon}</span>
              <Link href={`/team/${team.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                {team.name}
              </Link>
            </div>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-lg font-semibold">Views</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New view
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Favorites</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {views
                .filter((view) => view.favorite)
                .map((view) => (
                  <div
                    key={view.id}
                    className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(view)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFavorite(view.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            Remove from favorites
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteView(view.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-yellow-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(view.id)
                        }}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(view.filters).length} filters applied
                      </span>
                    </div>
                  </div>
                ))}
              {views.filter(v => v.favorite).length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">No favorite views yet. Star a view to add it here.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">All Views</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {views
                .filter((view) => !view.favorite)
                .map((view) => (
                  <div
                    key={view.id}
                    className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md cursor-pointer"
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(view)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFavorite(view.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            Add to favorites
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteView(view.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(view.id)
                        }}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {Object.keys(view.filters).length} filters applied
                      </span>
                    </div>
                  </div>
                ))}
              {views.filter(v => !v.favorite).length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full">No views. Click "New view" to create one.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create View Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new view for {team.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                placeholder="View name"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newViewDescription}
                onChange={(e) => setNewViewDescription(e.target.value)}
                placeholder="What does this view show?"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Icon</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {viewIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewViewIcon(icon)}
                    className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                      newViewIcon === icon
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
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
            <Button onClick={handleCreateView} disabled={!newViewName.trim()}>
              Create view
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit View Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit view</DialogTitle>
          </DialogHeader>
          {editingView && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingView.name}
                  onChange={(e) => setEditingView({ ...editingView, name: e.target.value })}
                  placeholder="View name"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={editingView.description}
                  onChange={(e) => setEditingView({ ...editingView, description: e.target.value })}
                  placeholder="What does this view show?"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {viewIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setEditingView({ ...editingView, icon })}
                      className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                        editingView.icon === icon
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditView} disabled={!editingView?.name.trim()}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
