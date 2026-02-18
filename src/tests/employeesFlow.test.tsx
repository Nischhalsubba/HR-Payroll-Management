import { render, screen, waitFor, within } from '@testing-library/react'
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

describe('employee interactions', () => {
  it('creates, changes status, and deletes an employee', { timeout: 15_000 }, async () => {
    const user = userEvent.setup()
    const employeeName = `Automation Employee ${Date.now()}`
    const employeeEmail = `automation.${Date.now()}@hrminds.com`

    renderApp('/auth/login')

    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Employee List' })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: '+ Add Employee' }))
    const dialog = screen.getByRole('dialog', { name: 'Add Employee' })

    await user.type(within(dialog).getByLabelText('Name'), employeeName)
    await user.type(within(dialog).getByLabelText('Email'), employeeEmail)
    await user.type(within(dialog).getByLabelText('Job Title'), 'QA Engineer')
    await user.type(within(dialog).getByLabelText('Department'), 'Engineering')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(screen.getByText(employeeName)).toBeInTheDocument()
    })

    const createdRow = screen.getByText(employeeName).closest('tr')
    expect(createdRow).toBeTruthy()

    if (!createdRow) {
      return
    }

    await user.click(within(createdRow).getByRole('button', { name: 'Actions' }))
    await user.click(screen.getByRole('menuitem', { name: 'Change Status' }))

    await waitFor(() => {
      const updatedRow = screen.getByText(employeeName).closest('tr')
      expect(updatedRow).toBeTruthy()

      if (!updatedRow) {
        return
      }

      expect(within(updatedRow).getByText('On-Leave')).toBeInTheDocument()
    })

    const rowForDelete = screen.getByText(employeeName).closest('tr')
    expect(rowForDelete).toBeTruthy()

    if (!rowForDelete) {
      return
    }

    await user.click(within(rowForDelete).getByRole('button', { name: 'Actions' }))
    await user.click(screen.getByRole('menuitem', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByText(employeeName)).not.toBeInTheDocument()
    })
  })
})
