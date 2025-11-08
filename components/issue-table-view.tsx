"use client"

import { type Issue, mockUsers, mockProjects } from "@/lib/mock-data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"

interface IssueTableViewProps {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
}

export function IssueTableView({ issues, onIssueClick }: IssueTableViewProps) {
  const getPriorityIcon = (priority: Issue["priority"]) => {
    const colors = {
      urgent: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-yellow-500",
      low: "bg-blue-500",
      none: "bg-muted-foreground",
    }
    return <div className={`h-2 w-2 rounded-full ${colors[priority]}`} />
  }

  const statusLabels = {
    backlog: "Backlog",
    todo: "Todo",
    "in-progress": "In Progress",
    done: "Done",
    canceled: "Canceled",
  }

  const statusColors = {
    backlog: "bg-muted text-muted-foreground",
    todo: "bg-blue-500/10 text-blue-500",
    "in-progress": "bg-yellow-500/10 text-yellow-500",
    done: "bg-green-500/10 text-green-500",
    canceled: "bg-muted text-muted-foreground",
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="w-8 py-2 pl-4">
              <Checkbox />
            </th>
            <th className="w-24 py-2">ID</th>
            <th className="min-w-[300px] py-2">Title</th>
            <th className="w-32 py-2">Status</th>
            <th className="w-24 py-2">Priority</th>
            <th className="w-32 py-2">Assignee</th>
            <th className="w-40 py-2">Project</th>
            <th className="w-20 py-2 text-center">Est.</th>
            <th className="w-8 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => {
            const assignee = mockUsers.find((u) => u.id === issue.assigneeId)
            const project = mockProjects.find((p) => p.id === issue.projectId)

            return (
              <tr
                key={issue.id}
                onClick={() => onIssueClick?.(issue)}
                className="group cursor-pointer border-b border-border hover:bg-accent/50"
              >
                <td className="py-2 pl-4">
                  <Checkbox onClick={(e) => e.stopPropagation()} />
                </td>
                <td className="py-2">
                  <span className="text-xs text-muted-foreground">{issue.identifier}</span>
                </td>
                <td className="py-2">
                  <span className="text-sm">{issue.title}</span>
                </td>
                <td className="py-2">
                  <Badge variant="secondary" className={`${statusColors[issue.status]} border-none`}>
                    {statusLabels[issue.status]}
                  </Badge>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(issue.priority)}
                    <span className="text-xs capitalize text-muted-foreground">{issue.priority}</span>
                  </div>
                </td>
                <td className="py-2">
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                        <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{assignee.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-2">
                  {project && (
                    <div className="flex items-center gap-2">
                      <span>{project.icon}</span>
                      <span className="text-sm">{project.name}</span>
                    </div>
                  )}
                </td>
                <td className="py-2 text-center">
                  {issue.estimate && <span className="text-xs text-muted-foreground">{issue.estimate}</span>}
                </td>
                <td className="py-2 pr-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
