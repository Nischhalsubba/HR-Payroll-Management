import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/authService'
import { saveResetContext } from '../../utils/storage'

const schema = z.object({
  email: z.email('Enter a valid email.'),
})

type FormValue = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(schema),
  })

  const onSubmit = handleSubmit(async (value) => {
    setSubmitError('')
    try {
      const reset = await authService.requestPasswordReset(value.email)
      saveResetContext({
        email: reset.email,
        requestId: reset.requestId,
      })
      push('OTP sent to your email. Use 157428 in mock mode.', 'info')
      navigate('/auth/otp')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not send OTP.'
      setSubmitError(message)
      push(message, 'error')
    }
  })

  return (
    <div className="auth-card narrow">
      <h1>Forgot password?</h1>
      <p>Enter your registered email and we will send a 6-digit verification code.</p>

      <form className="stack-md" onSubmit={onSubmit}>
        <Field label="Email" id="forgot-email" type="email" error={errors.email?.message} {...register('email')} />
        {submitError ? <p className="field-message">{submitError}</p> : null}
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send OTP'}
        </Button>

        <p className="subtle-center">
          Remembered your password? <Link to="/auth/login">Back to Login</Link>
        </p>
      </form>
    </div>
  )
}
