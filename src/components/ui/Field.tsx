import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, error, className, id, ...rest },
  ref,
) {
  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input ref={ref} id={id} className={cn('field-input', error && 'field-error', className)} {...rest} />
      {error ? <p className="field-message">{error}</p> : null}
    </div>
  )
})
