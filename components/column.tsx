"use client"

import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import TaskCard from "@/components/task-card"
import type { Task, TaskStatus } from "@/types/task"
import { cn } from "@/lib/utils"

interface ColumnProps {
  id: TaskStatus
  title: string
  color: string
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export default function Column({ id, title, color, tasks, onEditTask, onDeleteTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  })

  return (
    <div className="flex flex-col h-full">
      <div className={cn("rounded-lg p-4 mb-4", color)}>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 min-h-[200px] p-2 rounded-lg border-2 border-dashed transition-colors",
          isOver ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600",
        )}
      >
        <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            ))}
          </div>
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <p className="text-sm">Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  )
}
