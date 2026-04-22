import { useState } from 'react'
import StatsPanel from './components/StatsPanel'
import CategoryFilter from './components/CategoryFilter'
import QuickAddBar from './components/QuickAddBar'
import TodoList from './components/TodoList'
import type { Priority } from './store/todoStore'

function App() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [priority] = useState<Priority | ''>('')
  const [status] = useState<'all' | 'active' | 'completed'>('all')

  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航 */}
      <header className="px-8 pt-8 pb-4">
        <h1 className="text-4xl font-bold text-blue-700 mb-4" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          待办清单
        </h1>
        <p className="text-sm text-gray-400">
          <span className="font-medium text-gray-600">Todo List</span>
          <span className="mx-2 text-gray-300">·</span>
          高效管理每日任务
        </p>
      </header>
      <div className="h-px bg-blue-100 mx-0" />

      {/* 主体双栏 */}
      <div className="flex flex-1 gap-6 p-6">
        {/* 左侧栏 */}
        <aside className="w-64 flex-shrink-0 flex flex-col gap-4">
          <StatsPanel />
          <CategoryFilter selected={category} onChange={setCategory} />
        </aside>

        {/* 右侧主区域 */}
        <main className="flex-1 flex flex-col gap-4 min-w-0">
          <QuickAddBar />
          <TodoList
            search={search}
            onSearchChange={setSearch}
            category={category}
            priority={priority}
            status={status}
          />
        </main>
      </div>
    </div>
  )
}

export default App
