import { createContext, useContext, useMemo, useState } from 'react'

interface ToastItem {
  id: number
  message: string
  kind: 'success' | 'error' | 'info'
}

interface ToastContextValue {
  toasts: ToastItem[]
  push: (message: string, kind?: ToastItem['kind']) => void
  remove: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const value = useMemo<ToastContextValue>(() => {
    return {
      toasts,
      push(message, kind = 'info') {
        const id = Date.now() + Math.floor(Math.random() * 1000)
        setToasts((prev) => [...prev, { id, message, kind }])

        window.setTimeout(() => {
          setToasts((prev) => prev.filter((item) => item.id !== id))
        }, 3000)
      },
      remove(id) {
        setToasts((prev) => prev.filter((item) => item.id !== id))
      },
    }
  }, [toasts])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used in ToastProvider')
  }

  return ctx
}
