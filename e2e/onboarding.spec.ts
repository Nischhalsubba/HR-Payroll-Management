import { expect, test } from '@playwright/test'

test('onboarding to login flow', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('HRMinds')).toBeVisible()
  await page.getByRole('button', { name: 'Get Started' }).click({ timeout: 10_000 }).catch(async () => {
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Get Started' }).click()
  })

  await expect(page.getByRole('heading', { name: 'Welcome to HRMinds' })).toBeVisible()
})
