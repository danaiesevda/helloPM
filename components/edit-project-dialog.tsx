"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppState } from "@/lib/store"
import { type Project } from "@/lib/mock-data"

const projectIcons = ["🎯", "🚀", "💻", "📊", "🎨", "🔧", "📱", "🌐", "🎭", "⚙️"]
const projectColors = [
  "#ef4444", "#f59e0b", "#eab308", "#84cc16", "#22c55e",
  "#10b981", "#14b8a6", "#06b6d4", "#3b82f6", "#6366f1",
  "#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e",
]

interface EditProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project | null
}

export function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const { state, updateProject } = useAppState()
  const teams = state.teams
  const users = state.users

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState(projectIcons[0])
  const [color, setColor] = useState(projectColors[0])
  const [teamId, setTeamId] = useState("")
  const [status, setStatus] = useState<"active" | "planned" | "completed">("planned")
  const [lead, setLead] = useState("")

  // Populate form when project changes
  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description || "")
      setIcon(project.icon)
      setColor(project.color)
      setTeamId(project.teamId)
      setStatus(project.status as "active" | "planned" | "completed")
      setLead(project.lead || "")
    }
  }, [project])

  const handleSubmit = () => {
    if (!project || !name.trim() || !teamId) return

    updateProject(project.id, {
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      teamId,
      status,
      lead: lead || undefined,
    })
    onOpenChange(false)
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-project-name">Project name *</Label>
            <Input
              id="edit-project-name"
              placeholder="e.g., Q4 Product Launch"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-project-description">Description</Label>
            <Textarea
              id="edit-project-description"
              placeholder="Add a description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="flex flex-wrap gap-2">
              {projectIcons.map((iconOption) => (
                <button
                  key={iconOption}
                  type="button"
                  onClick={() => setIcon(iconOption)}
                  className={`w-10 h-10 rounded-lg border-2 text-xl transition-all ${
                    icon === iconOption
                      ? "border-primary bg-primary/10 scale-110"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {iconOption}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {projectColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Team *</Label>
              <Select value={teamId} onValueChange={setTeamId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      <div className="flex items-center gap-2">
                        <span>{team.icon}</span>
                        <span>{team.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value: "active" | "planned" | "completed") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project lead</Label>
            <Select value={lead || "none"} onValueChange={(value) => setLead(value === "none" ? "" : value)}>
              <SelectTrigger>
                <SelectValue placeholder="No lead" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No lead</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !teamId}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}





