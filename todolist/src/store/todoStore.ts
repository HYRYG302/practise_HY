import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type Priority = 'high' | 'medium' | 'low'

export interface Todo {
  id: string
  text: string
  description?: string
  dueDate?: string       // YYYY-MM-DD
  category: string
  completed: boolean
  priority: Priority
  createdAt: string
}

export type NewTodo = Omit<Todo, 'id' | 'completed' | 'createdAt'>
export type UpdateTodo = Partial<Omit<Todo, 'id' | 'createdAt'>>

const DEFAULT_CATEGORIES = ['工作', '学习', '生活', '其他']

interface TodoState {
  todos: Todo[]
  categories: string[]
  addTodo: (data: NewTodo) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updateTodo: (id: string, data: UpdateTodo) => void
  clearCompleted: () => void
  clearAll: () => void
  addCategory: (name: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      todos: [],
      categories: DEFAULT_CATEGORIES,

      addTodo: (data: NewTodo) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              ...data,
              id: crypto.randomUUID(),
              text: data.text.trim(),
              completed: false,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      toggleTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),

      deleteTodo: (id: string) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),

      updateTodo: (id: string, data: UpdateTodo) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, ...data } : todo
          ),
        })),

      clearCompleted: () =>
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        })),

      clearAll: () => set({ todos: [] }),

      addCategory: (name: string) =>
        set((state) => ({
          categories: state.categories.includes(name)
            ? state.categories
            : [...state.categories, name],
        })),
    }),
    {
      name: 'todo-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
