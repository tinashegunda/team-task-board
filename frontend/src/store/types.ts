export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE'

export type User = {
  id: string
  name: string
  email: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string
  createdAt: string
  updatedAt: string
  assignee: User
}

export type ListTasksQuery = {
  status?: TaskStatus
  assigneeId?: string
}
