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
  const errorId = error && id ? `${id}-error` : undefined

  return (
    <div className="field-wrap">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        className={cn('field-input', error && 'field-error', className)}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...rest}
      />
      {error ? (
        <p className="field-message" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  )
})
