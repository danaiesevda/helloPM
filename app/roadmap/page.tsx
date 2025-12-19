"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { mockProjects, mockIssues } from "@/lib/mock-data"
import { Plus, ChevronDown, Calendar, MoreHorizontal, Trash2, Edit2, Target } from "lucide-react"
import { Progress } from "@/components/ui/progress"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Milestone {
  id: string
  name: string
  description: string
  icon: string
  color: string
  quarterId: string
  month?: string
  progress: number
}

const milestoneIcons = ["🎯", "🚀", "⭐", "🔥", "💡", "🏆", "📦", "🎨", "🔧", "📱", "🌐", "🔒"]
const milestoneColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

const initialMilestones: Milestone[] = [
  {
    id: "1",
    name: "Product Launch v2.0",
    description: "Major release with new features and improvements",
    icon: "🚀",
    color: "#3b82f6",
    quarterId: "q1-2025",
    month: "Feb",
    progress: 65,
  },
  {
    id: "2",
    name: "Mobile App Release",
    description: "Launch iOS and Android apps",
    icon: "📱",
    color: "#10b981",
    quarterId: "q1-2025",
    month: "Mar",
    progress: 30,
  },
  {
    id: "3",
    name: "Enterprise Features",
    description: "SSO, SAML, advanced permissions",
    icon: "🔒",
    color: "#8b5cf6",
    quarterId: "q2-2025",
    month: "Apr",
    progress: 10,
  },
  {
    id: "4",
    name: "API v3 Launch",
    description: "New API version with improved performance",
    icon: "🔧",
    color: "#f59e0b",
    quarterId: "q2-2025",
    month: "Jun",
    progress: 0,
  },
  {
    id: "5",
    name: "Analytics Dashboard",
    description: "Comprehensive analytics and reporting",
    icon: "📊",
    color: "#ec4899",
    quarterId: "q3-2025",
    progress: 0,
  },
]

export default function RoadmapPage() {
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"quarters" | "months">("quarters")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  
  // Form state
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newIcon, setNewIcon] = useState(milestoneIcons[0])
  const [newColor, setNewColor] = useState(milestoneColors[0])
  const [newQuarterId, setNewQuarterId] = useState("")
  const [newMonth, setNewMonth] = useState("")

  const quarters = [
    { id: `q1-${selectedYear}`, label: `Q1 ${selectedYear}`, months: ["Jan", "Feb", "Mar"] },
    { id: `q2-${selectedYear}`, label: `Q2 ${selectedYear}`, months: ["Apr", "May", "Jun"] },
    { id: `q3-${selectedYear}`, label: `Q3 ${selectedYear}`, months: ["Jul", "Aug", "Sep"] },
    { id: `q4-${selectedYear}`, label: `Q4 ${selectedYear}`, months: ["Oct", "Nov", "Dec"] },
  ]

  const allMonths = [
    { id: "Jan", label: "January", quarter: "q1" },
    { id: "Feb", label: "February", quarter: "q1" },
    { id: "Mar", label: "March", quarter: "q1" },
    { id: "Apr", label: "April", quarter: "q2" },
    { id: "May", label: "May", quarter: "q2" },
    { id: "Jun", label: "June", quarter: "q2" },
    { id: "Jul", label: "July", quarter: "q3" },
    { id: "Aug", label: "August", quarter: "q3" },
    { id: "Sep", label: "September", quarter: "q3" },
    { id: "Oct", label: "October", quarter: "q4" },
    { id: "Nov", label: "November", quarter: "q4" },
    { id: "Dec", label: "December", quarter: "q4" },
  ]

  const resetForm = () => {
    setNewName("")
    setNewDescription("")
    setNewIcon(milestoneIcons[0])
    setNewColor(milestoneColors[0])
    setNewQuarterId("")
    setNewMonth("")
  }

  const handleCreateMilestone = () => {
    if (!newName.trim() || !newQuarterId) return
    
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      name: newName.trim(),
      description: newDescription.trim(),
      icon: newIcon,
      color: newColor,
      quarterId: newQuarterId,
      month: newMonth || undefined,
      progress: 0,
    }
    
    setMilestones([...milestones, newMilestone])
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditMilestone = () => {
    if (!editingMilestone || !newName.trim() || !newQuarterId) return
    
    setMilestones(milestones.map(m => 
      m.id === editingMilestone.id 
        ? {
            ...m,
            name: newName.trim(),
            description: newDescription.trim(),
            icon: newIcon,
            color: newColor,
            quarterId: newQuarterId,
            month: newMonth || undefined,
          }
        : m
    ))
    setIsEditDialogOpen(false)
    setEditingMilestone(null)
    resetForm()
  }

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id))
  }

  const openEditDialog = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setNewName(milestone.name)
    setNewDescription(milestone.description)
    setNewIcon(milestone.icon)
    setNewColor(milestone.color)
    setNewQuarterId(milestone.quarterId)
    setNewMonth(milestone.month || "")
    setIsEditDialogOpen(true)
  }

  const getMilestonesForQuarter = (quarterId: string) => {
    return milestones.filter(m => m.quarterId === quarterId)
  }

  const getMilestonesForMonth = (month: string) => {
    return milestones.filter(m => m.month === month)
  }

  const MilestoneCard = ({ milestone }: { milestone: Milestone }) => (
    <div 
      className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
      style={{ borderLeftColor: milestone.color, borderLeftWidth: 3 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl"
            style={{ backgroundColor: `${milestone.color}20` }}
          >
            {milestone.icon}
          </div>
          <div>
            <h3 className="font-semibold">{milestone.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{milestone.description}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openEditDialog(milestone)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleDeleteMilestone(milestone.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{milestone.progress}%</span>
        </div>
        <Progress value={milestone.progress} className="h-2" />
      </div>
      
      {milestone.month && (
        <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{milestone.month} {selectedYear}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      <Sidebar onSearchClick={() => setIsCommandOpen(true)} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5" />
            <h1 className="text-xl font-semibold">Roadmap</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-sm">
                  <span>{selectedYear}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedYear("2024")}>2024</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear("2025")}>2025</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedYear("2026")}>2026</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              <Button 
                variant={viewMode === "quarters" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-sm"
                onClick={() => setViewMode("quarters")}
              >
                Quarters
              </Button>
              <Button 
                variant={viewMode === "months" ? "secondary" : "ghost"} 
                size="sm" 
                className="h-7 text-sm"
                onClick={() => setViewMode("months")}
              >
                Months
              </Button>
            </div>
            <Button size="sm" className="h-8 gap-1.5" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              <span>New milestone</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === "quarters" ? (
            <div className="space-y-8">
              {quarters.map((quarter) => {
                const quarterMilestones = getMilestonesForQuarter(quarter.id)
                return (
                  <div key={quarter.id}>
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">{quarter.label}</h2>
                        <span className="text-sm text-muted-foreground">{quarter.months.join(" · ")}</span>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {quarterMilestones.length} milestones
                        </span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 gap-1 text-xs"
                        onClick={() => {
                          setNewQuarterId(quarter.id)
                          setIsCreateDialogOpen(true)
                        }}
                      >
                        <Plus className="h-3 w-3" />
                        Add milestone
                      </Button>
                    </div>

                    {quarterMilestones.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {quarterMilestones.map((milestone) => (
                          <MilestoneCard key={milestone.id} milestone={milestone} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
                        <p className="text-sm text-muted-foreground">No milestones for {quarter.label}</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            setNewQuarterId(quarter.id)
                            setIsCreateDialogOpen(true)
                          }}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Add milestone
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {allMonths.map((month) => {
                const monthMilestones = getMilestonesForMonth(month.id)
                return (
                  <div key={month.id}>
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{month.label} {selectedYear}</h3>
                        {monthMilestones.length > 0 && (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                            {monthMilestones.length}
                          </span>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 gap-1 text-xs"
                        onClick={() => {
                          const quarter = quarters.find(q => q.months.includes(month.id))
                          if (quarter) {
                            setNewQuarterId(quarter.id)
                            setNewMonth(month.id)
                            setIsCreateDialogOpen(true)
                          }
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    {monthMilestones.length > 0 ? (
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {monthMilestones.map((milestone) => (
                          <MilestoneCard key={milestone.id} milestone={milestone} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border border-dashed border-border bg-muted/20 px-4 py-3 text-center text-sm text-muted-foreground">
                        No milestones
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Create Milestone Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create new milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Milestone name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe this milestone..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quarter</label>
                <Select value={newQuarterId} onValueChange={setNewQuarterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    {quarters.map((q) => (
                      <SelectItem key={q.id} value={q.id}>{q.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Month (optional)</label>
                <Select value={newMonth || "none"} onValueChange={(val) => setNewMonth(val === "none" ? "" : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific month</SelectItem>
                    {newQuarterId && quarters.find(q => q.id === newQuarterId)?.months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {milestoneIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewIcon(icon)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-all ${
                      newIcon === icon 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {milestoneColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      newColor === color 
                        ? "border-foreground scale-110" 
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateMilestone} disabled={!newName.trim() || !newQuarterId}>
              Create milestone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Milestone Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setEditingMilestone(null)
          resetForm()
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Milestone name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe this milestone..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quarter</label>
                <Select value={newQuarterId} onValueChange={setNewQuarterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quarter" />
                  </SelectTrigger>
                  <SelectContent>
                    {quarters.map((q) => (
                      <SelectItem key={q.id} value={q.id}>{q.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Month (optional)</label>
                <Select value={newMonth || "none"} onValueChange={(val) => setNewMonth(val === "none" ? "" : val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific month</SelectItem>
                    {newQuarterId && quarters.find(q => q.id === newQuarterId)?.months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {milestoneIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewIcon(icon)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 text-xl transition-all ${
                      newIcon === icon 
                        ? "border-primary bg-primary/10" 
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {milestoneColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      newColor === color 
                        ? "border-foreground scale-110" 
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMilestone} disabled={!newName.trim() || !newQuarterId}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CommandPalette open={isCommandOpen} onOpenChange={setIsCommandOpen} />
    </div>
  )
}
