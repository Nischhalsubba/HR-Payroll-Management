import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/authService'

const loginSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

type FormValue = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { push } = useToast()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@hrminds.com',
      password: 'Password@123',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')

    try {
      const user = await authService.login(values)
      signIn(user)
      push('Signed in successfully.', 'success')
      navigate('/app/employees')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.'
      setSubmitError(message)
      push(message, 'error')
    }
  })

  return (
    <div className="auth-card">
      <h1>Welcome to HRMinds</h1>
      <p>Sign in to manage your workforce seamlessly.</p>

      <form className="stack-md" onSubmit={onSubmit}>
        <Field
          label="Email"
          id="login-email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Password"
          id="login-password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        <Link className="text-link align-end" to="/auth/forgot-password">
          Forgot Password?
        </Link>

        {submitError ? <p className="field-message">{submitError}</p> : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Login'}
        </Button>

        <p className="subtle-center">
          Don&apos;t have an account? <Link to="/auth/sign-up">Sign Up</Link>
        </p>
      </form>

      <div className="stack-sm">
        <Button type="button" variant="secondary" fullWidth onClick={() => push('Google SSO simulated.', 'info')}>
          Continue with Google
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={() => push('Microsoft SSO simulated.', 'info')}>
          Continue with Microsoft
        </Button>
      </div>
    </div>
  )
}
