import { useMemo } from 'react'
import { useTodoStore } from '../store/todoStore'
import TodoItem from './TodoItem'
import type { Priority } from '../store/todoStore'

interface TaskPanelProps {
  search: string
  onSearchChange: (v: string) => void
  category: string
  priority: Priority | ''
  status: 'all' | 'active' | 'completed'
}

export default function TodoList({ search, onSearchChange, category, priority, status }: TaskPanelProps) {
  const todos = useTodoStore((state) => state.todos)

  const filtered = useMemo(() => {
    return todos.filter((todo) => {
      if (search) {
        const q = search.toLowerCase()
        if (!todo.text.toLowerCase().includes(q) && !(todo.description ?? '').toLowerCase().includes(q)) return false
      }
      if (category && todo.category !== category) return false
      if (priority && todo.priority !== priority) return false
      if (status === 'active' && todo.completed) return false
      if (status === 'completed' && !todo.completed) return false
      return true
    })
  }, [todos, search, category, priority, status])

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 flex flex-col flex-1">
      {/* 面板头部 */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-blue-50">
        <h2 className="text-base font-semibold text-gray-700">今日任务</h2>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索任务..."
            className="pl-4 pr-8 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all w-44"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 列表区 */}
      <div className="flex-1">
        {todos.length === 0 ? (
          <div className="text-center py-16 text-[#bbb] select-none">
            <p className="text-4xl mb-3">○</p>
            <p className="text-sm">暂无任务，开始添加吧</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-[#bbb] select-none">
            <p className="text-4xl mb-3">◎</p>
            <p className="text-sm">未找到符合条件的任务</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-blue-50">
            {filtered.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
