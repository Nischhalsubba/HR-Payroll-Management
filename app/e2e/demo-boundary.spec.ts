import { expect, test } from '@playwright/test'

test('makes the synthetic-data boundary visible and resets temporary browser state', async ({ page }) => {
  await page.goto('/')

  const notice = page.getByRole('note', { name: 'Prototype data notice' })
  await expect(notice).toContainText('Portfolio prototype')
  await expect(notice).toContainText('Do not enter real employee, salary, tax, bank, or identity information.')

  await page.evaluate(() => {
    localStorage.setItem('atlashr_onboarding_done', 'true')
    localStorage.setItem('atlashr_sidebar_compact', 'true')
    sessionStorage.setItem('atlashr_session', '{"id":"demo"}')
    sessionStorage.setItem('atlashr_reset_context', '{"email":"demo@example.com","requestId":"demo"}')
  })

  await notice.getByRole('button', { name: 'Reset demo' }).click()
  await expect(page).toHaveURL(/\/$/)

  const stored = await page.evaluate(() => ({
    onboarding: localStorage.getItem('atlashr_onboarding_done'),
    sidebar: localStorage.getItem('atlashr_sidebar_compact'),
    session: sessionStorage.getItem('atlashr_session'),
    resetContext: sessionStorage.getItem('atlashr_reset_context'),
  }))
  expect(stored).toEqual({
    onboarding: null,
    sidebar: null,
    session: null,
    resetContext: null,
  })
})
