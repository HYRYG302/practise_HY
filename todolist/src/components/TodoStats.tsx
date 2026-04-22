import { useState, useMemo } from 'react'
import { useTodoStore } from '../store/todoStore'
import type { Priority } from '../store/todoStore'

const PRIORITY_LABEL: Record<Priority, string> = {
  high: '🔴 高',
  medium: '🟡 中',
  low: '🟢 低',
}

const PRIORITY_BAR: Record<Priority, string> = {
  high: 'bg-red-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
}

function CircleProgress({ rate }: { rate: number }) {
  const r = 28
  const circumference = 2 * Math.PI * r
  const offset = circumference - (rate / 100) * circumference
  return (
    <svg width="72" height="72" className="-rotate-90">
      <circle cx="36" cy="36" r={r} stroke="#e0e7ff" strokeWidth="7" fill="none" />
      <circle
        cx="36"
        cy="36"
        r={r}
        stroke="url(#grad)"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function TodoStats() {
  const todos = useTodoStore((state) => state.todos)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)
  const clearAll = useTodoStore((state) => state.clearAll)

  const [confirmClearAll, setConfirmClearAll] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100)

    // 优先级分布
    const byPriority: Record<Priority, number> = { high: 0, medium: 0, low: 0 }
    todos.forEach((t) => {
      if (!t.completed) byPriority[t.priority ?? 'medium']++
    })

    // 分类分布（未完成）
    const byCategory: Record<string, number> = {}
    todos.forEach((t) => {
      if (!t.completed) {
        byCategory[t.category] = (byCategory[t.category] ?? 0) + 1
      }
    })

    // 逾期数
    const today = new Date().toISOString().slice(0, 10)
    const overdue = todos.filter(
      (t) => !t.completed && t.dueDate && t.dueDate < today
    ).length

    return { total, completed, active, rate, byPriority, byCategory, overdue }
  }, [todos])

  const handleClearAll = () => {
    if (confirmClearAll) {
      clearAll()
      setConfirmClearAll(false)
    } else {
      setConfirmClearAll(true)
    }
  }

  return (
    <div className="mt-6 border-t border-blue-50 pt-5 flex flex-col gap-4">
      {/* 概览行 */}
      <div className="flex items-center gap-4">
        {/* 环形进度 */}
        <div className="relative flex-shrink-0">
          <CircleProgress rate={stats.rate} />
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-blue-600 rotate-90" style={{ transform: 'translate(-50%,-50%) rotate(0deg)', top: '50%', left: '50%', position: 'absolute' }}>
            {stats.rate}%
          </span>
        </div>

        {/* 数字卡片 */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-xl bg-blue-50">
            <p className="text-xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-gray-500 mt-0.5">全部</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-indigo-50">
            <p className="text-xl font-bold text-indigo-500">{stats.active}</p>
            <p className="text-xs text-gray-500 mt-0.5">待办</p>
          </div>
          <div className="text-center p-2 rounded-xl bg-green-50">
            <p className="text-xl font-bold text-green-500">{stats.completed}</p>
            <p className="text-xs text-gray-500 mt-0.5">已完成</p>
          </div>
        </div>
      </div>

      {/* 逾期提示 */}
      {stats.overdue > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100">
          <span className="text-sm">⚠️</span>
          <span className="text-xs text-red-500 font-medium">
            有 {stats.overdue} 个任务已逾期，请尽快处理！
          </span>
        </div>
      )}

      {/* 展开详情 */}
      {stats.total > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-gray-400 hover:text-blue-500 transition-colors flex items-center gap-1 self-center"
        >
          {expanded ? '▲ 收起详情' : '▼ 展开详情'}
        </button>
      )}

      {expanded && (
        <div className="flex flex-col gap-4 pb-1">
          {/* 优先级分布 */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">待办优先级分布</p>
            <div className="flex flex-col gap-1.5">
              {(['high', 'medium', 'low'] as Priority[]).map((p) => {
                const count = stats.byPriority[p]
                const maxCount = Math.max(...Object.values(stats.byPriority), 1)
                const pct = Math.round((count / maxCount) * 100)
                return (
                  <div key={p} className="flex items-center gap-2">
                    <span className="text-xs w-10 text-gray-500 flex-shrink-0">{PRIORITY_LABEL[p]}</span>
                    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${PRIORITY_BAR[p]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 分类分布 */}
          {Object.keys(stats.byCategory).length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">待办分类分布</p>
              <div className="flex flex-col gap-1.5">
                {Object.entries(stats.byCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, count]) => {
                    const maxCount = Math.max(...Object.values(stats.byCategory), 1)
                    const pct = Math.round((count / maxCount) * 100)
                    return (
                      <div key={cat} className="flex items-center gap-2">
                        <span className="text-xs w-12 text-gray-500 truncate flex-shrink-0">{cat}</span>
                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-indigo-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-4 text-right">{count}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 操作按钮行 */}
      {(stats.completed > 0 || stats.total > 0) && (
        <div className="flex gap-2 justify-center pt-1">
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="px-4 py-2 rounded-xl text-xs text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all"
            >
              🗑️ 清空已完成
            </button>
          )}
          {stats.total > 0 && (
            confirmClearAll ? (
              <div className="flex gap-1.5 items-center">
                <span className="text-xs text-red-500 font-medium">确定全部清空？</span>
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 rounded-xl text-xs bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
                >
                  确定
                </button>
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="px-3 py-1.5 rounded-xl text-xs border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl text-xs text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 active:scale-95 transition-all"
              >
                ❌ 全部清空
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}
