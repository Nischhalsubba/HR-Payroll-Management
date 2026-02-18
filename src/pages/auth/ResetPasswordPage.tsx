import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/authService'
import { clearResetContext, loadResetContext } from '../../utils/storage'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must include uppercase letter.')
      .regex(/\d/, 'Must include number.'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

type FormValue = z.infer<typeof schema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const context = loadResetContext()
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!context?.resetToken) {
      navigate('/auth/forgot-password', { replace: true })
    }
  }, [context?.resetToken, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(schema),
  })

  if (!context?.resetToken) {
    return null
  }

  const { email, requestId, resetToken } = context

  const onSubmit = handleSubmit(async (value) => {
    setSubmitError('')

    try {
      await authService.resetPassword({
        email,
        resetToken,
        password: value.password,
      })

      authService.cleanupResetRequest(requestId)
      clearResetContext()
      push('Password reset successful. Please login.', 'success')
      navigate('/auth/login')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to reset password.'
      setSubmitError(message)
      push(message, 'error')
    }
  })

  return (
    <div className="auth-card narrow">
      <h1>Reset Your Password</h1>
      <p>Let&apos;s create a new password for your account.</p>

      <form className="stack-md" onSubmit={onSubmit}>
        <Field
          label="New Password"
          id="reset-password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Field
          label="Confirm Password"
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {submitError ? <p className="field-message">{submitError}</p> : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Save New Password'}
        </Button>
      </form>
    </div>
  )
}
