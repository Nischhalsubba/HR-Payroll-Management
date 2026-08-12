import { expect, test } from '@playwright/test'

test('employee create, status update, and delete flow', async ({ page }) => {
  await page.goto('/auth/login')

  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByRole('heading', { name: 'Employee List' })).toBeVisible()

  await page.getByRole('button', { name: '+ Add Employee' }).click()
  const dialog = page.getByRole('dialog', { name: 'Add Employee' })

  await dialog.getByRole('textbox', { name: 'Name' }).fill('E2E Employee')
  await dialog.getByRole('textbox', { name: 'Email' }).fill('e2e.employee@atlashr.com')
  await dialog.getByRole('textbox', { name: 'Job Title' }).fill('Analyst')
  await dialog.getByRole('textbox', { name: 'Department' }).fill('HR')
  await dialog.getByRole('button', { name: 'Save' }).click()

  const row = page.locator('tr', { hasText: 'E2E Employee' })
  await expect(row).toBeVisible()

  await row.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('menuitem', { name: 'Change Status' }).click()
  await expect(row.getByText('On-Leave')).toBeVisible()

  await row.getByRole('button', { name: 'Actions' }).click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await page.getByRole('button', { name: 'Delete' }).click()

  await expect(page.locator('tr', { hasText: 'E2E Employee' })).toHaveCount(0)
})
