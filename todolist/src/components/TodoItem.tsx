import { useState } from 'react'
import { format, isPast, parseISO, isToday } from 'date-fns'
import { useTodoStore } from '../store/todoStore'
import type { Priority, Todo } from '../store/todoStore'
import TodoModal from './TodoModal'

interface TodoItemProps {
  todo: Todo
}

const PRIORITY_CONFIG: Record<Priority, { label: string; style: string }> = {
  high: { label: '高', style: 'rounded-full border border-amber-400 text-amber-600 bg-amber-50' },
  medium: { label: '中', style: 'rounded-full border border-blue-400 text-blue-500 bg-blue-50' },
  low: { label: '低', style: 'rounded-full border border-green-400 text-green-600 bg-green-50' },
}

function formatDate(dueDate: string, completed: boolean) {
  const date = parseISO(dueDate)
  const overdue = !completed && isPast(date) && !isToday(date)
  const formatted = format(date, 'yyyy-MM-dd')
  return { formatted, overdue }
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { id, text, description, dueDate, completed, priority, category } = todo
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)

  const [editOpen, setEditOpen] = useState(false)
  const cfg = PRIORITY_CONFIG[priority ?? 'medium']

  return (
    <>
      <li className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-blue-50/50 transition-colors group">
        {/* 复选框 */}
        <input
          type="checkbox"
          checked={completed}
          onChange={() => toggleTodo(id)}
          className="w-4 h-4 flex-shrink-0 cursor-pointer accent-blue-500"
        />

        {/* 内容区 */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {text}
          </p>
          {description && (
            <p className={`text-xs mt-0.5 truncate ${completed ? 'text-gray-300' : 'text-gray-500'}`}>
              {description}
            </p>
          )}
        </div>

        {/* 右侧标签区 */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* 分类标签 */}
          <span className="text-xs px-2.5 py-1 rounded-full border border-blue-200 text-blue-600 bg-blue-50 font-medium">
            {category}
          </span>

          {/* 优先级标签 */}
          <span className={`text-xs px-2.5 py-1 font-medium ${cfg.style}`}>
            {cfg.label}
          </span>

          {/* 截止日期 */}
          {dueDate && (() => {
            const { formatted, overdue } = formatDate(dueDate, completed)
            return (
              <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-[#999]'}`}>
                {formatted}
              </span>
            )
          })()}

          {/* 操作按钮（hover 可见） */}
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
            {!completed && (
              <button
                onClick={() => setEditOpen(true)}
                className="px-2 py-1 text-xs rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                aria-label="编辑"
              >
                编辑
              </button>
            )}
            <button
              onClick={() => deleteTodo(id)}
              className="px-2 py-1 text-xs rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="删除"
            >
              删除
            </button>
          </div>
        </div>
      </li>

      {editOpen && (
        <TodoModal mode="edit" todo={todo} onClose={() => setEditOpen(false)} />
      )}
    </>
  )
}
