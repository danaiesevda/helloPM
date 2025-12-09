"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { mockIssues, mockProjects, mockTeams, mockUsers } from "@/lib/mock-data"
import { FileText, FolderKanban, Users, Settings, Inbox, ListTodo, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, onOpenChange])

  const handleSelect = useCallback(
    (callback: () => void) => {
      onOpenChange(false)
      callback()
    },
    [onOpenChange],
  )

  const filteredIssues = mockIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(search.toLowerCase()) ||
      issue.identifier.toLowerCase().includes(search.toLowerCase()),
  )

  const filteredProjects = mockProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))

  const filteredTeams = mockTeams.filter((team) => team.name.toLowerCase().includes(search.toLowerCase()))

  const filteredUsers = mockUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search issues, projects, people..." value={search} onValueChange={setSearch} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {search === "" && (
          <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => handleSelect(() => router.push("/inbox"))}>
                <Inbox className="mr-2 h-4 w-4" />
                <span>Inbox</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push("/my-issues"))}>
                <ListTodo className="mr-2 h-4 w-4" />
                <span>My Issues</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push("/projects"))}>
                <FolderKanban className="mr-2 h-4 w-4" />
                <span>Projects</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push("/roadmap"))}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Roadmap</span>
              </CommandItem>
              <CommandItem onSelect={() => handleSelect(() => router.push("/settings"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
        )}

        {search !== "" && filteredIssues.length > 0 && (
          <>
            <CommandGroup heading="Issues">
              {filteredIssues.slice(0, 5).map((issue) => (
                <CommandItem
                  key={issue.id}
                  onSelect={() => handleSelect(() => console.log("Open issue:", issue.id))}
                  value={`${issue.identifier} ${issue.title}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{issue.identifier}</span>
                      <span>{issue.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{issue.status.replace("-", " ")}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {search !== "" && filteredProjects.length > 0 && (
          <>
            <CommandGroup heading="Projects">
              {filteredProjects.map((project) => (
                <CommandItem
                  key={project.id}
                  onSelect={() => handleSelect(() => router.push(`/projects/${project.id}`))}
                  value={project.name}
                >
                  <FolderKanban className="mr-2 h-4 w-4" />
                  <div className="flex items-center gap-2">
                    <span>{project.icon}</span>
                    <span>{project.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {search !== "" && filteredTeams.length > 0 && (
          <>
            <CommandGroup heading="Teams">
              {filteredTeams.map((team) => (
                <CommandItem
                  key={team.id}
                  onSelect={() => handleSelect(() => router.push(`/team/${team.id}`))}
                  value={team.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <div className="flex items-center gap-2">
                    <span>{team.icon}</span>
                    <span>{team.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        {search !== "" && filteredUsers.length > 0 && (
          <CommandGroup heading="People">
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                onSelect={() => handleSelect(() => console.log("View user:", user.id))}
                value={user.name}
              >
                <Avatar className="mr-2 h-4 w-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
