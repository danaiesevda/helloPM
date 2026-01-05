"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { useAppState } from "@/lib/store"

interface FilterState {
  status: string[]
  priority: string[]
  assignee: string[]
  project: string[]
}

interface FilterDropdownProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function FilterDropdown({ filters, onFiltersChange }: FilterDropdownProps) {
  const [localFilters, setLocalFilters] = useState(filters)
  const { state } = useAppState()
  const users = state.users
  const projects = state.projects

  const statuses = ["backlog", "todo", "in-progress", "done", "canceled"]
  const priorities = ["urgent", "high", "medium", "low", "none"]

  const handleFilterChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const newFilters = { ...localFilters }
    if (checked) {
      newFilters[category] = [...newFilters[category], value]
    } else {
      newFilters[category] = newFilters[category].filter((v) => v !== value)
    }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const activeFilterCount = Object.values(localFilters).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 relative">
          <Filter className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        {statuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={localFilters.status.includes(status)}
            onCheckedChange={(checked) => handleFilterChange("status", status, checked)}
          >
            <span className="capitalize">{status.replace("-", " ")}</span>
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Priority</DropdownMenuLabel>
        {priorities.map((priority) => (
          <DropdownMenuCheckboxItem
            key={priority}
            checked={localFilters.priority.includes(priority)}
            onCheckedChange={(checked) => handleFilterChange("priority", priority, checked)}
          >
            <span className="capitalize">{priority}</span>
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Assignee</DropdownMenuLabel>
        {users.map((user) => (
          <DropdownMenuCheckboxItem
            key={user.id}
            checked={localFilters.assignee.includes(user.id)}
            onCheckedChange={(checked) => handleFilterChange("assignee", user.id, checked)}
          >
            {user.name}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Project</DropdownMenuLabel>
        {projects.map((project) => (
          <DropdownMenuCheckboxItem
            key={project.id}
            checked={localFilters.project.includes(project.id)}
            onCheckedChange={(checked) => handleFilterChange("project", project.id, checked)}
          >
            <span className="mr-2">{project.icon}</span>
            {project.name}
          </DropdownMenuCheckboxItem>
        ))}

        {activeFilterCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => {
                const emptyFilters = {
                  status: [],
                  priority: [],
                  assignee: [],
                  project: [],
                }
                setLocalFilters(emptyFilters)
                onFiltersChange(emptyFilters)
              }}
            >
              Clear all filters
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
