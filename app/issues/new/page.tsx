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
import { mockProjects, mockUsers, type Issue } from "@/lib/mock-data"
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

    // Navigate back to issues page
    router.push("/")
  }
