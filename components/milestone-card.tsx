"use client"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target } from "lucide-react"

interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  progress: number
  status: "planned" | "active" | "completed"
  projects: number
}

interface MilestoneCardProps {
  milestone: Milestone
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const statusColors = {
    planned: "bg-blue-500/10 text-blue-500",
    active: "bg-yellow-500/10 text-yellow-500",
    completed: "bg-green-500/10 text-green-500",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-all">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{milestone.name}</h3>
            <p className="text-sm text-muted-foreground">{milestone.description}</p>
          </div>
        </div>
        <Badge variant="secondary" className={statusColors[milestone.status]}>
          {milestone.status}
        </Badge>
      </div>

      <div className="mb-3 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{milestone.progress}%</span>
        </div>
        <Progress value={milestone.progress} className="h-2" />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{new Date(milestone.dueDate).toLocaleDateString()}</span>
        </div>
        <span>{milestone.projects} projects</span>
      </div>
    </div>
  )
}
