"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { type Issue, type Project, type User, type Team, type Label, mockData } from "./mock-data"

interface WorkspaceSettings {
  name: string
  url: string
  notifications: boolean
}

interface AppState {
  issues: Issue[]
  projects: Project[]
  users: User[]
  teams: Team[]
  labels: Label[]
  workspace: WorkspaceSettings
}

interface AppContextType {
  state: AppState
  // Issue actions
  updateIssue: (issueId: string, updates: Partial<Issue>) => void
  addIssue: (issue: Issue) => void
  deleteIssues: (issueIds: string[]) => void
  // Project actions
  updateProject: (projectId: string, updates: Partial<Project>) => void
  addProject: (project: Project) => void
  deleteProject: (projectId: string) => void
  // User actions
  updateUser: (userId: string, updates: Partial<User>) => void
  addUser: (user: User) => void
  deleteUser: (userId: string) => void
  // Team actions
  updateTeam: (teamId: string, updates: Partial<Team>) => void
  addTeam: (team: Team) => void
  deleteTeam: (teamId: string) => void
  // Label actions
  updateLabel: (labelId: string, updates: Partial<Label>) => void
  addLabel: (label: Label) => void
  deleteLabel: (labelId: string) => void
  // Workspace actions
  updateWorkspace: (updates: Partial<WorkspaceSettings>) => void
  // Reset
  resetToDefaults: () => void
}

const AppContext = createContext<AppContextType | null>(null)

const STORAGE_KEY = "hellopm-app-state"

const defaultWorkspace: WorkspaceSettings = {
  name: "Pine Apple",
  url: "pineapple.app",
  notifications: true,
}

// Always start with mock data for SSR consistency
function getInitialState(): AppState {
  return {
    issues: mockData.issues,
    projects: mockData.projects,
    users: mockData.users,
    teams: mockData.teams,
    labels: mockData.labels,
    workspace: defaultWorkspace,
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate state from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Migrate workspace name from "Ferrero Rocher" or variants to "Pine Apple"
        let workspace = parsed.workspace || defaultWorkspace
        if (workspace.name && (workspace.name.includes("Ferrero") || workspace.name.includes("Ferro") || workspace.name.toLowerCase().includes("ferrero"))) {
          workspace = { ...workspace, name: "Pine Apple" }
        }
        setState({
          issues: parsed.issues || mockData.issues,
          projects: parsed.projects || mockData.projects,
          users: parsed.users || mockData.users,
          teams: parsed.teams || mockData.teams,
          labels: parsed.labels || mockData.labels,
          workspace: workspace,
        })
      }
    } catch (e) {
      console.error("Failed to parse stored state:", e)
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isHydrated])

  // Issue actions
  const updateIssue = (issueId: string, updates: Partial<Issue>) => {
    setState((prev) => ({
      ...prev,
      issues: prev.issues.map((issue) =>
        issue.id === issueId ? { ...issue, ...updates, updatedAt: new Date().toISOString() } : issue
      ),
    }))
  }

  const addIssue = (issue: Issue) => {
    setState((prev) => ({
      ...prev,
      issues: [...prev.issues, issue],
    }))
  }

  const deleteIssues = (issueIds: string[]) => {
    setState((prev) => ({
      ...prev,
      issues: prev.issues.filter((issue) => !issueIds.includes(issue.id)),
    }))
  }

  // Project actions
  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      ),
    }))
  }

  const addProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }))
  }

  const deleteProject = (projectId: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== projectId),
    }))
  }

  // User actions
  const updateUser = (userId: string, updates: Partial<User>) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.map((user) =>
        user.id === userId ? { ...user, ...updates } : user
      ),
    }))
  }

  const addUser = (user: User) => {
    setState((prev) => ({
      ...prev,
      users: [...prev.users, user],
    }))
  }

  const deleteUser = (userId: string) => {
    setState((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.id !== userId),
    }))
  }

  // Team actions
  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.map((team) =>
        team.id === teamId ? { ...team, ...updates } : team
      ),
    }))
  }

  const addTeam = (team: Team) => {
    setState((prev) => ({
      ...prev,
      teams: [...prev.teams, team],
    }))
  }

  const deleteTeam = (teamId: string) => {
    setState((prev) => ({
      ...prev,
      teams: prev.teams.filter((team) => team.id !== teamId),
    }))
  }

  // Label actions
  const updateLabel = (labelId: string, updates: Partial<Label>) => {
    setState((prev) => ({
      ...prev,
      labels: prev.labels.map((label) =>
        label.id === labelId ? { ...label, ...updates } : label
      ),
    }))
  }

  const addLabel = (label: Label) => {
    setState((prev) => ({
      ...prev,
      labels: [...prev.labels, label],
    }))
  }

  const deleteLabel = (labelId: string) => {
    setState((prev) => ({
      ...prev,
      labels: prev.labels.filter((label) => label.id !== labelId),
    }))
  }

  // Workspace actions
  const updateWorkspace = (updates: Partial<WorkspaceSettings>) => {
    setState((prev) => ({
      ...prev,
      workspace: { ...prev.workspace, ...updates },
    }))
  }

  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      issues: mockData.issues,
      projects: mockData.projects,
      users: mockData.users,
      teams: mockData.teams,
      labels: mockData.labels,
      workspace: defaultWorkspace,
    })
  }

  return (
    <AppContext.Provider
      value={{
        state,
        updateIssue,
        addIssue,
        deleteIssues,
        updateProject,
        addProject,
        deleteProject,
        updateUser,
        addUser,
        deleteUser,
        updateTeam,
        addTeam,
        deleteTeam,
        updateLabel,
        addLabel,
        deleteLabel,
        updateWorkspace,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppProvider")
  }
  return context
}














