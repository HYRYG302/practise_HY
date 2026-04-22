import { useMemo } from 'react'
import { useTodoStore } from '../store/todoStore'

export default function StatsPanel() {
  const todos = useTodoStore((state) => state.todos)

  const stats = useMemo(() => {
    const total = todos.length
    const completed = todos.filter((t) => t.completed).length
    const active = total - completed
    const rate = total === 0 ? 0 : Math.round((completed / total) * 100)
    return { total, completed, active, rate }
  }, [todos])

  const rows = [
    { label: '总任务', value: stats.total, color: '#1e40af' },
    { label: '待完成', value: stats.active, color: '#d97706' },
    { label: '已完成', value: stats.completed, color: '#16a34a' },
    { label: '完成率', value: `${stats.rate}%`, color: '#1e40af' },
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-5">
      <p className="text-xs text-blue-400 mb-4 font-medium tracking-widest">统计数据</p>
      <div className="flex flex-col divide-y divide-blue-50">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <span className="text-sm text-[#555]">{row.label}</span>
            <span className="text-xl font-semibold" style={{ color: row.color }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
