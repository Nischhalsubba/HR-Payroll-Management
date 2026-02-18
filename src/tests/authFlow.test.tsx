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

describe('auth flow', () => {
  it('logs in and navigates to employees page', async () => {
    const user = userEvent.setup()
    renderApp('/auth/login')

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Employee List' })).toBeInTheDocument()
    })
  })
})
