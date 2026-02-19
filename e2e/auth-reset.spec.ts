import { expect, test } from '@playwright/test'

test('forgot password to reset journey', async ({ page }) => {
  await page.goto('/auth/forgot-password')

  await page.getByLabel('Email').fill('admin@atlashr.com')
  await page.getByRole('button', { name: 'Send OTP' }).click()

  await expect(page.getByRole('heading', { name: 'Verify code' })).toBeVisible()

  const digits = page.getByLabel(/OTP digit/)
  await digits.nth(0).fill('1')
  await digits.nth(1).fill('5')
  await digits.nth(2).fill('7')
  await digits.nth(3).fill('4')
  await digits.nth(4).fill('2')
  await digits.nth(5).fill('8')

  await page.getByRole('button', { name: 'Verify OTP' }).click()
  await expect(page.getByRole('heading', { name: 'Reset your password' })).toBeVisible()

  await page.getByLabel('New Password').fill('Password@456')
  await page.getByLabel('Confirm Password').fill('Password@456')
  await page.getByRole('button', { name: 'Save New Password' }).click()

  await expect(page.getByRole('heading', { name: 'Welcome to AtlasHR' })).toBeVisible()
})
