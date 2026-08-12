import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

type Variant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger'
type Size = 'lg' | 'sm'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  iconLeft?: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  tertiary: 'btn btn-tertiary',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, children, fullWidth, iconLeft, size = 'lg', variant = 'primary', ...rest },
  ref,
) {
  return (
    <button ref={ref} className={cn(variants[variant], `btn-${size}`, fullWidth && 'w-full', className)} {...rest}>
      {iconLeft ? <span className="btn-icon">{iconLeft}</span> : null}
      {children}
    </button>
  )
})
