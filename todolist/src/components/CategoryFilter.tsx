import { useTodoStore } from '../store/todoStore'

interface CategoryFilterProps {
  selected: string
  onChange: (cat: string) => void
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const categories = useTodoStore((state) => state.categories)
  const items = ['全部任务', ...categories]

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-blue-100 p-5">
      <p className="text-xs text-blue-400 mb-4 font-medium tracking-widest">分类筛选</p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => {
          const value = item === '全部任务' ? '' : item
          const active = selected === value
          return (
            <button
              key={item}
              onClick={() => onChange(value)}
              className={`w-full text-left px-4 py-2.5 text-sm rounded-xl transition-colors ${
                active
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-blue-100 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {item}
            </button>
          )
        })}
      </div>
    </div>
  )
}
