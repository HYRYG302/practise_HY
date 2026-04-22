import { useState } from 'react'
import { useTodoStore } from '../store/todoStore'
import type { Priority } from '../store/todoStore'

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

export default function QuickAddBar() {
  const addTodo = useTodoStore((state) => state.addTodo)
  const categories = useTodoStore((state) => state.categories)

  const [text, setText] = useState('')
  const [category, setCategory] = useState(categories[0] ?? '工作')
  const [priority, setPriority] = useState<Priority>('high')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    addTodo({ text: text.trim(), category, priority })
    setText('')
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-5">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4 items-end">
          {/* 任务标题 */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs text-gray-500 font-medium">任务标题</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入任务内容..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
            />
          </div>
    
          {/* 分类 */}
          <div className="flex flex-col gap-1.5 w-32">
            <label className="text-xs text-gray-500 font-medium">分类</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
    
          {/* 优先级 */}
          <div className="flex flex-col gap-1.5 w-28">
            <label className="text-xs text-gray-500 font-medium">优先级</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
    
          {/* 添加按鈕 */}
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium shadow-md hover:bg-blue-600 active:scale-95 transition-all flex-shrink-0"
          >
            添加
          </button>
        </div>
      </form>
    </div>
  )
}
