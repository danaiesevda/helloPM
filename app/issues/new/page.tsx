"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { mockTeams, mockProjects, mockUsers, type Issue } from "@/lib/mock-data"
import { useAppState } from "@/lib/store"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"

export default function CreateIssuePage() {
  const router = useRouter()
  const { state, addIssue } = useAppState()
  const availableLabels = state.labels
  
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"backlog" | "todo" | "in-progress" | "done" | "canceled">("todo")
  const [priority, setPriority] = useState<"urgent" | "high" | "medium" | "low" | "none">("none")
  const [assigneeId, setAssigneeId] = useState<string>("")
  const [projectId, setProjectId] = useState<string>("")
  const [teamId, setTeamId] = useState<string>(state.teams[0]?.id || "")
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [dueDate, setDueDate] = useState("")
  const [estimate, setEstimate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    // Generate new ID - handle empty array and non-numeric IDs safely
    const numericIds = state.issues
      .map(i => {
        const parsed = parseInt(i.id)
        return isNaN(parsed) ? 0 : parsed
      })
      .filter(id => id > 0)
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0
    const newId = (maxId + 1).toString()

    // Find the highest TASK number from existing identifiers
    const tesNumbers = state.issues
      .map(i => {
        const match = i.identifier.match(/TASK-(\d+)/)
        return match ? parseInt(match[1]) : 0
      })
      .filter(num => num > 0)
    const nextTaskNumber = tesNumbers.length > 0 ? Math.max(...tesNumbers) + 1 : 1

    const newIssue: Issue = {
      id: newId,
      identifier: `TASK-${nextTaskNumber}`,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId: assigneeId || null,
      projectId: projectId || null,
      teamId: teamId || "1",
      labels: selectedLabels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: dueDate || null,
      estimate: estimate ? parseInt(estimate) : null,
      createdBy: "1",
    }

    addIssue(newIssue)
    router.push("/")
  }

  const toggleLabel = (labelId: string) => {
    setSelectedLabels((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    )
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden overflow-x-hidden">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden min-w-0 w-full max-w-full">
        <header className="border-b border-border px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground">TASK-{state.issues.length + 1}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-500">Todo</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0 max-w-full">
          <div className="flex flex-1 overflow-hidden min-w-0">
            {/* Main Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4 min-w-0 shrink">
              <h1 className="mb-6 text-2xl font-semibold">New issue</h1>
              
              {/* Title Input */}
              <div className="mb-6">
                <Input
                  placeholder="Issue title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold border-none p-0 focus-visible:ring-0 shadow-none"
                />
              </div>

              {/* Description Editor */}
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Description</h3>
                <Textarea
                  placeholder="Add description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              {/* Activity / Comments Section */}
              <div className="border-t border-border pt-4">
                <h3 className="mb-3 text-sm font-medium">Activity</h3>
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    Y
                  </div>
                  <div className="flex-1">
                    <Textarea placeholder="Add a comment..." className="min-h-[80px] resize-none" />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" type="button">
                        Cancel
                      </Button>
                      <Button size="sm" type="button">Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Properties */}
            <div className="w-[380px] min-w-[380px] max-w-[380px] shrink-0 border-l border-border bg-muted/30 px-4 py-4 overflow-y-auto overflow-x-hidden">
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start">
                      <SelectItem value="backlog">Backlog</SelectItem>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Priority */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Priority
                  </label>
                  <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent side="left" align="start">
                      <SelectItem value="none">No priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Assignee */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Assignee
                  </label>
                  <Select value={assigneeId || "unassigned"} onValueChange={(value) => setAssigneeId(value === "unassigned" ? "" : value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent side="left" align="start">
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Labels */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Labels
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableLabels.map((label) => {
                      const isSelected = selectedLabels.includes(label.id)
                      return (
                        <button
                          key={label.id}
                          type="button"
                          onClick={() => toggleLabel(label.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs transition-colors ${
                            isSelected
                              ? "border border-foreground"
                              : "border border-border hover:border-foreground/50"
                          }`}
                          style={{
                            backgroundColor: isSelected ? `${label.color}20` : "transparent",
                            color: isSelected ? label.color : "inherit",
                          }}
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: label.color }}
                          />
                          {label.name}
                        </button>
                      )
                    })}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {}}
                    >
                      + Add
                    </Button>
                  </div>
                </div>

                {/* Project */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Project
                  </label>
                  <Select value={projectId || "none"} onValueChange={(value) => setProjectId(value === "none" ? "" : value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="No project" />
                    </SelectTrigger>
                    <SelectContent side="left" align="start">
                      <SelectItem value="none">No project</SelectItem>
                      {mockProjects
                        .filter((p) => p.teamId === teamId)
                        .map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <span>{project.icon}</span>
                              <span>{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Due date */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Due date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Estimate */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Estimate
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={estimate}
                    onChange={(e) => setEstimate(e.target.value)}
                    min="0"
                    className="w-full"
                  />
                </div>

                {/* Created/Updated dates */}
                <div className="pt-4 border-t border-border space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Created {new Date().toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Updated {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3 shrink-0">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!title.trim()}>
              Create issue
            </Button>
          </div>
        </form>
      </main>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}

