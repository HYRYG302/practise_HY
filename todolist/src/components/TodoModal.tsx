import { useState, useEffect, useRef } from 'react'
import { useTodoStore } from '../store/todoStore'
import type { Todo, Priority } from '../store/todoStore'

interface TodoModalProps {
  mode: 'add' | 'edit'
  todo?: Todo
  onClose: () => void
}

const PRIORITY_OPTIONS: { value: Priority; label: string; activeClass: string }[] = [
  { value: 'high', label: '🔴 高', activeClass: 'bg-red-100 border-red-400 text-red-700' },
  { value: 'medium', label: '🟡 中', activeClass: 'bg-yellow-100 border-yellow-400 text-yellow-700' },
  { value: 'low', label: '🟢 低', activeClass: 'bg-green-100 border-green-400 text-green-700' },
]

export default function TodoModal({ mode, todo, onClose }: TodoModalProps) {
  const addTodo = useTodoStore((state) => state.addTodo)
  const updateTodo = useTodoStore((state) => state.updateTodo)
  const categories = useTodoStore((state) => state.categories)
  const addCategory = useTodoStore((state) => state.addCategory)

  const [text, setText] = useState(todo?.text ?? '')
  const [description, setDescription] = useState(todo?.description ?? '')
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? '')
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'medium')
  const [category, setCategory] = useState(todo?.category ?? categories[0])
  const [customCategory, setCustomCategory] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [error, setError] = useState('')

  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleCategoryChange = (val: string) => {
    if (val === '__custom__') {
      setShowCustomInput(true)
    } else {
      setCategory(val)
      setShowCustomInput(false)
    }
  }

  const handleAddCustomCategory = () => {
    const name = customCategory.trim()
    if (!name) return
    addCategory(name)
    setCategory(name)
    setShowCustomInput(false)
    setCustomCategory('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('任务标题不能为空')
      titleRef.current?.focus()
      return
    }
    const payload = {
      text: text.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      category,
    }
    if (mode === 'add') {
      addTodo(payload)
    } else if (todo) {
      updateTodo(todo.id, payload)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
        {/* 标题栏 */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {mode === 'add' ? '➕ 添加任务' : '✏️ 编辑任务'}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl leading-none transition-colors"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              标题 <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={text}
              onChange={(e) => { setText(e.target.value); setError('') }}
              placeholder="任务标题…"
              className={`w-full px-4 py-2.5 rounded-xl border text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">描述（可选）</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="添加详细说明…"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* 截止日期 + 优先级 */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">截止日期</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">优先级</label>
              <div className="flex gap-1.5">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      priority === opt.value
                        ? opt.activeClass + ' shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-blue-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">分类</label>
            <div className="flex gap-2">
              <select
                value={showCustomInput ? '__custom__' : category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">+ 新建分类…</option>
              </select>
              {showCustomInput && (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                    placeholder="分类名…"
                    className="w-24 px-3 py-2.5 rounded-xl border border-blue-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-3 py-2.5 rounded-xl bg-blue-500 text-white text-sm hover:bg-blue-600 active:scale-95 transition-all"
                  >
                    确认
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95 transition-all font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 active:scale-95 transition-all"
            >
              {mode === 'add' ? '添加' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
