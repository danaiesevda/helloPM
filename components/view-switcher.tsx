"use client"

import { Button } from "@/components/ui/button"
import { List, LayoutGrid, Table } from "lucide-react"

export type ViewType = "list" | "board" | "table"

interface ViewSwitcherProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

export function ViewSwitcher({ currentView, onViewChange }: ViewSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
      <Button
        variant={currentView === "list" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 gap-1.5 px-2"
        onClick={() => onViewChange("list")}
      >
        <List className="h-3.5 w-3.5" />
        <span className="text-xs">List</span>
      </Button>
      <Button
        variant={currentView === "board" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 gap-1.5 px-2"
        onClick={() => onViewChange("board")}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="text-xs">Board</span>
      </Button>
      <Button
        variant={currentView === "table" ? "secondary" : "ghost"}
        size="sm"
        className="h-7 gap-1.5 px-2"
        onClick={() => onViewChange("table")}
      >
        <Table className="h-3.5 w-3.5" />
        <span className="text-xs">Table</span>
      </Button>
    </div>
  )
}
