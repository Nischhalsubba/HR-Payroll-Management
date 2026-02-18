import { forwardRef } from 'react'
import { cn } from '../../utils/helpers'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'btn btn-primary',
  secondary: 'btn btn-secondary',
  ghost: 'btn btn-ghost',
  danger: 'btn btn-danger',
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, fullWidth, variant = 'primary', ...rest },
  ref,
) {
  return <button ref={ref} className={cn(variants[variant], fullWidth && 'w-full', className)} {...rest} />
})
