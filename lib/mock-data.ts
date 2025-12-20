// Mock data for the PineApple clone

export interface User {
  id: string
  name: string
  email: string
  avatar: string | null
  role: "admin" | "member" | "viewer"
  teamIds: string[]
}

export interface Team {
  id: string
  name: string
  icon: string
  key: string
  identifier?: string
  memberCount: number
}

export interface Label {
  id: string
  name: string
  color: string
}

export interface Project {
  id: string
  name: string
  icon: string
  color: string
  description: string
  teamId: string
  status: "active" | "planned" | "completed"
  progress: number
  startDate: string | null
  endDate: string | null
  lead: string | null
  issueCount?: number
}

export interface Issue {
  id: string
  identifier: string
  title: string
  description: string
  status: "backlog" | "todo" | "in-progress" | "done" | "canceled"
  priority: "urgent" | "high" | "medium" | "low" | "none"
  assigneeId: string | null
  projectId: string | null
  teamId: string
  labels: string[]
  createdAt: string
  updatedAt: string
  dueDate: string | null
  estimate: number | null
  createdBy: string
}

export interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  progress: number
  status: "planned" | "active" | "completed"
  projects: number
}

export interface Status {
  id: string
  name: string
  type: "backlog" | "unstarted" | "started" | "completed" | "canceled"
}

export interface Priority {
  id: string
  name: string
  level: number
}

export interface Notification {
  id: string
  type: "mention" | "assigned" | "comment" | "status_change"
  title: string
  message: string
  issueId: string
  isRead: boolean
  createdAt: string
  actor: string
}

export interface Comment {
  id: string
  issueId: string
  userId: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: "created" | "updated" | "commented" | "status_changed" | "assigned"
  userId: string
  issueId: string
  description: string
  createdAt: string
  metadata?: Record<string, any>
}

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar: "/professional-woman-diverse.png",
    role: "admin",
    teamIds: ["1", "2"],
  },
  {
    id: "2",
    name: "Alex Rivera",
    email: "alex@example.com",
    avatar: "/professional-person.png",
    role: "member",
    teamIds: ["1"],
  },
  {
    id: "3",
    name: "Jordan Lee",
    email: "jordan@example.com",
    avatar: "/diverse-person.png",
    role: "member",
    teamIds: ["1", "2"],
  },
  {
    id: "4",
    name: "Morgan Taylor",
    email: "morgan@example.com",
    avatar: "/professional-avatar.png",
    role: "member",
    teamIds: ["2"],
  },
]

export const mockTeams: Team[] = [
  {
    id: "1",
    name: "Engineering",
    icon: "⚙️",
    key: "ENG",
    memberCount: 3,
  },
  {
    id: "2",
    name: "Design",
    icon: "🎨",
    key: "DES",
    memberCount: 2,
  },
]

export const mockLabels: Label[] = [
  { id: "1", name: "Bug", color: "#ef4444" },
  { id: "2", name: "Feature", color: "#8b5cf6" },
  { id: "3", name: "Improvement", color: "#22c55e" },
  { id: "4", name: "Documentation", color: "#06b6d4" },
  { id: "5", name: "Performance", color: "#84cc16" },
  { id: "6", name: "Security", color: "#f87171" },
]

export const mockStatuses: Status[] = [
  { id: "backlog", name: "Backlog", type: "backlog" },
  { id: "todo", name: "Todo", type: "unstarted" },
  { id: "in-progress", name: "In Progress", type: "started" },
  { id: "done", name: "Done", type: "completed" },
  { id: "canceled", name: "Canceled", type: "canceled" },
]

export const mockPriorities: Priority[] = [
  { id: "urgent", name: "Urgent", level: 4 },
  { id: "high", name: "High", level: 3 },
  { id: "medium", name: "Medium", level: 2 },
  { id: "low", name: "Low", level: 1 },
  { id: "none", name: "No priority", level: 0 },
]

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    icon: "🌐",
    color: "#3b82f6",
    description: "Complete redesign of the company website with modern UI/UX",
    teamId: "1",
    status: "active",
    progress: 65,
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    lead: "1",
  },
  {
    id: "2",
    name: "Mobile App",
    icon: "📱",
    color: "#8b5cf6",
    description: "Build native mobile app for iOS and Android",
    teamId: "1",
    status: "active",
    progress: 35,
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    lead: "2",
  },
  {
    id: "3",
    name: "Design System",
    icon: "🎨",
    color: "#10b981",
    description: "Create comprehensive design system and component library",
    teamId: "2",
    status: "planned",
    progress: 15,
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    lead: "4",
  },
]

export const mockIssues: Issue[] = [
  {
    id: "1",
    identifier: "TASK-1",
    title: "Get familiar with PineApple",
    description: "Explore the PineApple interface and learn how to use it effectively for project management",
    status: "todo",
    priority: "medium",
    assigneeId: "1",
    projectId: "1",
    teamId: "1",
    labels: ["2"],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    dueDate: null,
    estimate: 2,
    createdBy: "1",
  },
  {
    id: "2",
    identifier: "TASK-2",
    title: "Set up your teams",
    description: "Create teams and add team members with appropriate roles and permissions",
    status: "todo",
    priority: "high",
    assigneeId: "2",
    projectId: "1",
    teamId: "1",
    labels: ["3"],
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    dueDate: "2024-01-20T00:00:00Z",
    estimate: 2,
    createdBy: "1",
  },
  {
    id: "3",
    identifier: "TASK-3",
    title: "Connect your tools",
    description: "Integrate with GitHub, Slack, and other essential development tools",
    status: "todo",
    priority: "medium",
    assigneeId: "3",
    projectId: "2",
    teamId: "1",
    labels: ["3"],
    createdAt: "2024-01-15T12:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
    dueDate: null,
    estimate: 3,
    createdBy: "2",
  },
  {
    id: "4",
    identifier: "TASK-4",
    title: "Import your data",
    description: "Import existing issues and projects from other project management tools",
    status: "todo",
    priority: "low",
    assigneeId: "1",
    projectId: "2",
    teamId: "1",
    labels: ["3"],
    createdAt: "2024-01-15T13:00:00Z",
    updatedAt: "2024-01-15T13:00:00Z",
    dueDate: null,
    estimate: 4,
    createdBy: "1",
  },
  {
    id: "5",
    identifier: "TASK-5",
    title: "Design new dashboard",
    description: "Create mockups for the new analytics dashboard with key metrics and charts",
    status: "in-progress",
    priority: "high",
    assigneeId: "2",
    projectId: "1",
    teamId: "1",
    labels: ["2"],
    createdAt: "2024-01-16T09:00:00Z",
    updatedAt: "2024-01-16T14:00:00Z",
    dueDate: "2024-01-25T00:00:00Z",
    estimate: 5,
    createdBy: "1",
  },
  {
    id: "6",
    identifier: "TASK-6",
    title: "Fix login bug",
    description: "Users are unable to login with Google OAuth. Investigation shows token refresh issue",
    status: "in-progress",
    priority: "urgent",
    assigneeId: "1",
    projectId: null,
    teamId: "1",
    labels: ["1"],
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T15:00:00Z",
    dueDate: "2024-01-18T00:00:00Z",
    estimate: 2,
    createdBy: "2",
  },
  {
    id: "7",
    identifier: "DES-1",
    title: "Create color palette",
    description: "Define primary, secondary, and semantic colors for the design system",
    status: "done",
    priority: "high",
    assigneeId: "4",
    projectId: "3",
    teamId: "2",
    labels: ["2", "4"],
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-14T16:00:00Z",
    dueDate: null,
    estimate: 3,
    createdBy: "4",
  },
  {
    id: "8",
    identifier: "DES-2",
    title: "Typography system",
    description: "Establish font families, sizes, weights, and line heights",
    status: "done",
    priority: "high",
    assigneeId: "4",
    projectId: "3",
    teamId: "2",
    labels: ["2"],
    createdAt: "2024-01-11T10:00:00Z",
    updatedAt: "2024-01-15T14:00:00Z",
    dueDate: null,
    estimate: 2,
    createdBy: "4",
  },
  {
    id: "9",
    identifier: "ENG-10",
    title: "API performance optimization",
    description: "Optimize API response times and implement caching strategies",
    status: "backlog",
    priority: "medium",
    assigneeId: null,
    projectId: "2",
    teamId: "1",
    labels: ["5"],
    createdAt: "2024-01-17T11:00:00Z",
    updatedAt: "2024-01-17T11:00:00Z",
    dueDate: null,
    estimate: 8,
    createdBy: "2",
  },
  {
    id: "10",
    identifier: "ENG-11",
    title: "Security audit",
    description: "Conduct comprehensive security audit of the application",
    status: "backlog",
    priority: "urgent",
    assigneeId: null,
    projectId: null,
    teamId: "1",
    labels: ["6"],
    createdAt: "2024-01-17T12:00:00Z",
    updatedAt: "2024-01-17T12:00:00Z",
    dueDate: "2024-02-01T00:00:00Z",
    estimate: 5,
    createdBy: "1",
  },
]

export const mockMilestones: Milestone[] = [
  {
    id: "1",
    name: "Q1 2024 Launch",
    description: "Launch the new website and mobile app to production",
    dueDate: "2024-03-31T00:00:00Z",
    progress: 45,
    status: "active",
    projects: 2,
  },
  {
    id: "2",
    name: "Beta Release",
    description: "Release beta version to select users for testing and feedback",
    dueDate: "2024-06-30T00:00:00Z",
    progress: 20,
    status: "planned",
    projects: 1,
  },
  {
    id: "3",
    name: "Design System v1.0",
    description: "Complete and publish version 1.0 of the design system",
    dueDate: "2024-05-31T00:00:00Z",
    progress: 15,
    status: "planned",
    projects: 1,
  },
]

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "assigned",
    title: "You were assigned to TASK-6",
    message: "Alex Rivera assigned you to Fix login bug",
    issueId: "6",
    isRead: false,
    createdAt: "2024-01-16T15:00:00Z",
    actor: "2",
  },
  {
    id: "2",
    type: "comment",
    title: "New comment on TASK-5",
    message: "Jordan Lee commented on Design new dashboard",
    issueId: "5",
    isRead: false,
    createdAt: "2024-01-16T14:30:00Z",
    actor: "3",
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned in TASK-2",
    message: "Alex Rivera mentioned you in Set up your teams",
    issueId: "2",
    isRead: true,
    createdAt: "2024-01-16T12:00:00Z",
    actor: "2",
  },
  {
    id: "4",
    type: "status_change",
    title: "TASK-5 status changed",
    message: "Sarah Chen moved Design new dashboard to In Progress",
    issueId: "5",
    isRead: true,
    createdAt: "2024-01-16T09:30:00Z",
    actor: "1",
  },
]

export const mockComments: Comment[] = [
  {
    id: "1",
    issueId: "5",
    userId: "3",
    content: "Looking great! Can we add a dark mode toggle to the dashboard?",
    createdAt: "2024-01-16T14:30:00Z",
    updatedAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "2",
    issueId: "5",
    userId: "2",
    content: "Good idea! I'll add that to the mockups.",
    createdAt: "2024-01-16T15:00:00Z",
    updatedAt: "2024-01-16T15:00:00Z",
  },
  {
    id: "3",
    issueId: "6",
    userId: "1",
    content: "I've identified the issue - it's related to the token refresh mechanism. Working on a fix now.",
    createdAt: "2024-01-16T15:30:00Z",
    updatedAt: "2024-01-16T15:30:00Z",
  },
]

export const mockActivities: Activity[] = [
  {
    id: "1",
    type: "created",
    userId: "1",
    issueId: "1",
    description: "created this issue",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    type: "status_changed",
    userId: "1",
    issueId: "5",
    description: "changed status from Todo to In Progress",
    createdAt: "2024-01-16T09:30:00Z",
    metadata: { from: "todo", to: "in-progress" },
  },
  {
    id: "3",
    type: "assigned",
    userId: "2",
    issueId: "6",
    description: "assigned to Sarah Chen",
    createdAt: "2024-01-16T10:30:00Z",
    metadata: { assigneeId: "1" },
  },
  {
    id: "4",
    type: "commented",
    userId: "3",
    issueId: "5",
    description: "added a comment",
    createdAt: "2024-01-16T14:30:00Z",
  },
]

// Consolidated export
export const mockData = {
  users: mockUsers,
  teams: mockTeams,
  labels: mockLabels,
  statuses: mockStatuses,
  priorities: mockPriorities,
  projects: mockProjects,
  issues: mockIssues,
  milestones: mockMilestones,
  notifications: mockNotifications,
  comments: mockComments,
  activities: mockActivities,
}
