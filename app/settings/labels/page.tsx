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
import { ArrowLeft, Plus, Tag, MoreHorizontal, Trash2, Edit } from "lucide-react"
import { mockLabels } from "@/lib/mock-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const presetColors = [
  "#ef4444", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
]

export default function LabelsSettingsPage() {
  const [labels, setLabels] = useState(mockLabels)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<{ id: string; name: string; color: string } | null>(null)
  const [newLabelName, setNewLabelName] = useState("")
  const [newLabelColor, setNewLabelColor] = useState(presetColors[0])
  const [editLabelName, setEditLabelName] = useState("")
  const [editLabelColor, setEditLabelColor] = useState(presetColors[0])

  const handleCreateLabel = () => {
    if (!newLabelName.trim()) return

    const newLabel = {
      id: String(labels.length + 1),
      name: newLabelName.trim(),
      color: newLabelColor,
    }

    setLabels([...labels, newLabel])
    setNewLabelName("")
    setNewLabelColor(presetColors[0])
    setIsDialogOpen(false)
  }

  const handleEditLabel = (label: { id: string; name: string; color: string }) => {
    setEditingLabel(label)
    setEditLabelName(label.name)
    setEditLabelColor(label.color)
    setIsEditDialogOpen(true)
  }

  const handleSaveLabel = () => {
    if (!editingLabel || !editLabelName.trim()) return

    setLabels(
      labels.map((label) =>
        label.id === editingLabel.id
          ? { ...label, name: editLabelName.trim(), color: editLabelColor }
          : label
      )
    )
    setIsEditDialogOpen(false)
    setEditingLabel(null)
    setEditLabelName("")
    setEditLabelColor(presetColors[0])
  }

  const handleDeleteLabel = (labelId: string) => {
    setLabels(labels.filter((label) => label.id !== labelId))
  }

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
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground"
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
                  <h2 className="text-base font-semibold text-foreground">Labels</h2>
                  <p className="text-sm text-muted-foreground mt-1">Organize issues with custom labels</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Create label
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create label</DialogTitle>
                      <DialogDescription>Add a new label to organize your issues</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Label name</label>
                        <Input
                          placeholder="e.g., Bug, Feature, Documentation"
                          value={newLabelName}
                          onChange={(e) => setNewLabelName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCreateLabel()
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                        <div className="flex flex-wrap gap-2">
                          {presetColors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => setNewLabelColor(color)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                newLabelColor === color
                                  ? "border-foreground scale-110"
                                  : "border-border hover:border-foreground/50"
                              }`}
                              style={{ backgroundColor: color }}
                              aria-label={`Select color ${color}`}
                            />
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: newLabelColor }}
                          />
                          <span className="text-xs text-muted-foreground">{newLabelColor}</span>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateLabel} disabled={!newLabelName.trim()}>
                        Create label
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="divide-y divide-border">
                  {labels.map((label) => (
                    <div
                      key={label.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: label.color }}
                        />
                        <div>
                          <div className="text-sm font-medium text-foreground">{label.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Used in {parseInt(label.id) * 3 + 5} issues
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditLabel(label)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit label
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteLabel(label.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete label
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </div>

              {labels.length === 0 && (
                <div className="border border-dashed border-border rounded-lg p-12 text-center">
                  <Tag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-medium text-foreground mb-1">No labels</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first label to get started</p>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create label
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create label</DialogTitle>
                        <DialogDescription>Add a new label to organize your issues</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Label name</label>
                          <Input
                            placeholder="e.g., Bug, Feature, Documentation"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCreateLabel()
                              }
                            }}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                          <div className="flex flex-wrap gap-2">
                            {presetColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setNewLabelColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${
                                  newLabelColor === color
                                    ? "border-foreground scale-110"
                                    : "border-border hover:border-foreground/50"
                                }`}
                                style={{ backgroundColor: color }}
                                aria-label={`Select color ${color}`}
                              />
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: newLabelColor }}
                            />
                            <span className="text-xs text-muted-foreground">{newLabelColor}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateLabel} disabled={!newLabelName.trim()}>
                          Create label
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              {/* Edit Label Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit label</DialogTitle>
                    <DialogDescription>Update label name and color</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Label name</label>
                      <Input
                        placeholder="e.g., Bug, Feature, Documentation"
                        value={editLabelName}
                        onChange={(e) => setEditLabelName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveLabel()
                          }
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Color</label>
                      <div className="flex flex-wrap gap-2">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditLabelColor(color)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              editLabelColor === color
                                ? "border-foreground scale-110"
                                : "border-border hover:border-foreground/50"
                            }`}
                            style={{ backgroundColor: color }}
                            aria-label={`Select color ${color}`}
                          />
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: editLabelColor }}
                        />
                        <span className="text-xs text-muted-foreground">{editLabelColor}</span>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveLabel} disabled={!editLabelName.trim()}>
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

