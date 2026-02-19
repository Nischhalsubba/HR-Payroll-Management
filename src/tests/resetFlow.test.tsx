import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRouter } from '../app/AppRouter'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'

function renderApp(path: string) {
  return render(
    <AuthProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRouter />
        </MemoryRouter>
      </ToastProvider>
    </AuthProvider>,
  )
}

describe('password reset flow', () => {
  it('completes forgot password -> otp -> reset -> login path', async () => {
    const user = userEvent.setup()
    renderApp('/auth/forgot-password')

    await user.type(screen.getByLabelText('Email'), 'admin@atlashr.com')
    await user.click(screen.getByRole('button', { name: 'Send OTP' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Verify code' })).toBeInTheDocument()
    })

    const firstDigit = screen.getByLabelText('OTP digit 1')
    await user.click(firstDigit)
    await user.paste('157428')

    await user.click(screen.getByRole('button', { name: 'Verify OTP' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Reset your password' })).toBeInTheDocument()
    })

    await user.type(screen.getByLabelText('New Password'), 'Password@456')
    await user.type(screen.getByLabelText('Confirm Password'), 'Password@456')
    await user.click(screen.getByRole('button', { name: 'Save New Password' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Welcome to AtlasHR' })).toBeInTheDocument()
    })
  })
})
