import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils/helpers'

export function ToastViewport() {
  const { toasts, remove } = useToast()

  return (
    <div className="toast-viewport" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={cn('toast', `toast-${toast.kind}`)}>
          <span>{toast.message}</span>
          <button type="button" className="toast-close" onClick={() => remove(toast.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}
