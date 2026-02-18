import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/authService'

const schema = z
  .object({
    name: z.string().min(2, 'Name is required.'),
    email: z.email('Enter a valid email.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Must contain one uppercase letter.')
      .regex(/\d/, 'Must contain one number.'),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

type FormValue = z.infer<typeof schema>

export function SignupPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    try {
      await authService.signup(values)
      push('Account created. You can sign in now.', 'success')
      navigate('/auth/login')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create account.'
      setSubmitError(message)
      push(message, 'error')
    }
  })

  return (
    <div className="auth-card">
      <h1>Create your account</h1>
      <p>Set up HRMinds to start tracking team, attendance, and payroll workflows.</p>

      <form className="stack-md" onSubmit={onSubmit}>
        <Field label="Full Name" id="signup-name" error={errors.name?.message} {...register('name')} />
        <Field
          label="Email"
          id="signup-email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Field
          label="Password"
          id="signup-password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Field
          label="Confirm Password"
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {submitError ? <p className="field-message">{submitError}</p> : null}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="subtle-center">
          Already have an account? <Link to="/auth/login">Sign In</Link>
        </p>
      </form>
    </div>
  )
}
