import { useState } from 'react'
import TodoModal from './TodoModal'

export default function TodoInput() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 active:scale-95 transition-all mb-5"
      >
        ➕ 添加任务
      </button>
      {open && <TodoModal mode="add" onClose={() => setOpen(false)} />}
    </>
  )
}
