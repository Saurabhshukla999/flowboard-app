export type TaskStatus = "todo" | "in-progress" | "done"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate?: string
  userId: string
}

export interface User {
  id: string
  email: string
  token: string
}
