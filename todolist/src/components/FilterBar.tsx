import { useTodoStore } from '../store/todoStore'
import type { Priority } from '../store/todoStore'

export interface FilterState {
  search: string
  category: string    // '' = 全部
  priority: Priority | ''  // '' = 全部
  status: 'all' | 'active' | 'completed'
}

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const PRIORITY_OPTIONS: { value: Priority | ''; label: string }[] = [
  { value: '', label: '全部' },
  { value: 'high', label: '🔴 高' },
  { value: 'medium', label: '🟡 中' },
  { value: 'low', label: '🟢 低' },
]

const STATUS_OPTIONS: { value: FilterState['status']; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
]

function FilterChip<T extends string>({
  value,
  current,
  label,
  onClick,
}: {
  value: T
  current: T
  label: string
  onClick: (v: T) => void
}) {
  const active = value === current
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${
        active
          ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
          : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
      }`}
    >
      {label}
    </button>
  )
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const categories = useTodoStore((state) => state.categories)

  const set = (patch: Partial<FilterState>) => onChange({ ...filters, ...patch })

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* 搜索框 */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="搜索任务标题或描述…"
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm shadow-sm"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => set({ search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            ✕
          </button>
        )}
      </div>

      {/* 筛选行 */}
      <div className="flex flex-col gap-2">
        {/* 分类 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
          <span className="text-xs text-gray-400 flex-shrink-0">分类</span>
          <FilterChip value="" current={filters.category} label="全部" onClick={(v) => set({ category: v })} />
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              value={cat}
              current={filters.category}
              label={cat}
              onClick={(v) => set({ category: v })}
            />
          ))}
        </div>

        {/* 优先级 + 状态 */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex-shrink-0">优先级</span>
            {PRIORITY_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                value={opt.value}
                current={filters.priority}
                label={opt.label}
                onClick={(v) => set({ priority: v })}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 flex-shrink-0">状态</span>
            {STATUS_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                value={opt.value}
                current={filters.status}
                label={opt.label}
                onClick={(v) => set({ status: v })}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
