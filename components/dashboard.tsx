"use client"

import { useState, useEffect } from "react"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, closestCorners } from "@dnd-kit/core"
import Navbar from "@/components/navbar"
import Column from "@/components/column"
import TaskCard from "@/components/task-card"
import TaskModal from "@/components/task-modal"
import { useAuth } from "@/components/auth-context"
import type { Task, TaskStatus } from "@/types/task"

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
  { id: "in-progress", title: "In Progress", color: "bg-blue-100 dark:bg-blue-900" },
  { id: "done", title: "Done", color: "bg-green-100 dark:bg-green-900" },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("flowboard_tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    } else {
      // Initialize with sample tasks
      const sampleTasks: Task[] = [
        {
          id: "1",
          title: "Design new landing page",
          description: "Create a modern and responsive landing page for the product",
          status: "todo",
          dueDate: "2024-01-15",
          userId: user?.id || "",
        },
        {
          id: "2",
          title: "Implement user authentication",
          description: "Add JWT-based authentication system",
          status: "in-progress",
          dueDate: "2024-01-20",
          userId: user?.id || "",
        },
        {
          id: "3",
          title: "Setup CI/CD pipeline",
          description: "Configure automated deployment pipeline",
          status: "done",
          userId: user?.id || "",
        },
      ]
      setTasks(sampleTasks)
      localStorage.setItem("flowboard_tasks", JSON.stringify(sampleTasks))
    }
  }, [user])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("flowboard_tasks", JSON.stringify(tasks))
  }, [tasks])

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleCreateTask = (taskData: Omit<Task, "id" | "userId">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user?.id || "",
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleUpdateTask = (taskData: Omit<Task, "id" | "userId">) => {
    if (!editingTask) return

    setTasks((prev) => prev.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  const openCreateModal = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen">
      <Navbar onCreateTask={openCreateModal} />

      <div className="container mx-auto px-4 py-8">
        <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COLUMNS.map((column) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                color={column.color}
                tasks={tasks.filter((task) => task.status === column.id)}
                onEditTask={openEditModal}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
    </div>
  )
}
