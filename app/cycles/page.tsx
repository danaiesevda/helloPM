"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, TrendingUp, Target, ChevronRight, ArrowLeft } from "lucide-react"

export default function CyclesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "past">("active")

  const cycles = [
    {
      id: "cycle-1",
      name: "Sprint 24",
      startDate: "2025-01-06",
      endDate: "2025-01-19",
      status: "active",
      progress: 65,
      completedIssues: 13,
      totalIssues: 20,
    },
    {
      id: "cycle-2",
      name: "Sprint 25",
      startDate: "2025-01-20",
      endDate: "2025-02-02",
      status: "upcoming",
      progress: 0,
      completedIssues: 0,
      totalIssues: 0,
    },
    {
      id: "cycle-3",
      name: "Sprint 23",
      startDate: "2024-12-23",
      endDate: "2025-01-05",
      status: "past",
      progress: 100,
      completedIssues: 18,
      totalIssues: 18,
    },
  ]

  const filteredCycles = cycles.filter((c) => c.status === activeTab)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-start gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to app
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Cycles</h1>
        </div>

        <div className="border-b border-border px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === "active"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === "upcoming"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                activeTab === "past"
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl space-y-4">
            {filteredCycles.map((cycle) => (
              <div
                key={cycle.id}
                className="border border-border rounded-lg p-6 hover:border-border-hover transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">{cycle.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(cycle.startDate).toLocaleDateString()} -{" "}
                        {new Date(cycle.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {cycle.completedIssues}/{cycle.totalIssues} issues
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-muted rounded-md transition-colors">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{cycle.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${cycle.progress}%` }}
                    />
                  </div>
                </div>

                {cycle.status === "active" && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>On track to complete in 5 days</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredCycles.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-medium text-foreground mb-1">No {activeTab} cycles</h3>
                <p className="text-sm text-muted-foreground">Create a new cycle to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
