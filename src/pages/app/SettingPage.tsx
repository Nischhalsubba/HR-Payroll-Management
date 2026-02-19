import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo, useState } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../context/ToastContext'
import * as settingsService from '../../services/settingsService'
import type { AppSettings } from '../../types/settings'

const schema = z.object({
  orgName: z.string().min(2, 'Organization name is required.'),
  timezone: z.string().min(2, 'Timezone is required.'),
  dateFormat: z.enum(['MMM d, yyyy', 'dd/MM/yyyy', 'MM/dd/yyyy']),
  sessionTimeoutMinutes: z.number().min(5).max(240),
  twoFactorEnabled: z.boolean(),
  emailDigest: z.boolean(),
  inAppAlerts: z.boolean(),
  leaveAlerts: z.boolean(),
  payrollAlerts: z.boolean(),
  density: z.enum(['comfortable', 'compact']),
  accent: z.enum(['blue', 'orange']),
})

type FormValue = z.infer<typeof schema>
type TabKey = 'general' | 'security' | 'notifications' | 'appearance'

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'general', label: 'General' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'appearance', label: 'Appearance' },
]

function toForm(settings: AppSettings): FormValue {
  return {
    orgName: settings.orgName,
    timezone: settings.timezone,
    dateFormat: settings.dateFormat,
    sessionTimeoutMinutes: settings.security.sessionTimeoutMinutes,
    twoFactorEnabled: settings.security.twoFactorEnabled,
    emailDigest: settings.notifications.emailDigest,
    inAppAlerts: settings.notifications.inAppAlerts,
    leaveAlerts: settings.notifications.leaveAlerts,
    payrollAlerts: settings.notifications.payrollAlerts,
    density: settings.appearance.density,
    accent: settings.appearance.accent,
  }
}

function toSettings(form: FormValue): AppSettings {
  return {
    orgName: form.orgName,
    timezone: form.timezone,
    dateFormat: form.dateFormat,
    security: {
      sessionTimeoutMinutes: form.sessionTimeoutMinutes,
      twoFactorEnabled: form.twoFactorEnabled,
    },
    notifications: {
      emailDigest: form.emailDigest,
      inAppAlerts: form.inAppAlerts,
      leaveAlerts: form.leaveAlerts,
      payrollAlerts: form.payrollAlerts,
    },
    appearance: {
      density: form.density,
      accent: form.accent,
    },
  }
}

export function SettingPage() {
  const { push } = useToast()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('general')
  const [initialSnapshot, setInitialSnapshot] = useState<FormValue | null>(null)

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      orgName: '',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MMM d, yyyy',
      sessionTimeoutMinutes: 45,
      twoFactorEnabled: true,
      emailDigest: true,
      inAppAlerts: true,
      leaveAlerts: true,
      payrollAlerts: true,
      density: 'comfortable',
      accent: 'blue',
    },
  })

  const watchAll = useWatch({ control: form.control })

  const hasUnsavedChanges = useMemo(() => {
    if (!initialSnapshot) {
      return false
    }
    return JSON.stringify(watchAll) !== JSON.stringify(initialSnapshot)
  }, [initialSnapshot, watchAll])

  const blocker = useBlocker(hasUnsavedChanges)

  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) {
      return
    }
    event.preventDefault()
    event.returnValue = ''
  })

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return
    }
    const shouldProceed = window.confirm('You have unsaved changes. Leave this page?')
    if (shouldProceed) {
      blocker.proceed()
      return
    }
    blocker.reset()
  }, [blocker])

  useEffect(() => {
    const load = async () => {
      const settings = await settingsService.getSettings()
      const value = toForm(settings)
      form.reset(value)
      setInitialSnapshot(value)
      setLoading(false)
    }

    void load()
  }, [form])

  if (loading) {
    return <section className="panel status-box">Loading settings...</section>
  }

  return (
    <section className="panel stack-md settings-page">
      <div className="employee-grid-head">
        <div className="employee-grid-title">
          <h1>Setting</h1>
          <p>Control workspace, security, notifications, and appearance.</p>
        </div>
        {hasUnsavedChanges ? <span className="settings-unsaved">Unsaved changes</span> : null}
      </div>

      <div className="settings-tabs" role="tablist" aria-label="Setting tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={activeTab === tab.key ? 'settings-tab active' : 'settings-tab'}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form
        className="stack-md"
        onSubmit={form.handleSubmit(async (value) => {
          const next = toSettings(value)
          const saved = await settingsService.updateSettings(next)
          const snapshot = toForm(saved)
          form.reset(snapshot)
          setInitialSnapshot(snapshot)
          push('Settings saved.', 'success')
        })}
      >
        {activeTab === 'general' ? (
          <div className="settings-grid">
            <label className="field-wrap">
              <span className="field-label">Organization Name</span>
              <input className="field-input" {...form.register('orgName')} />
            </label>
            <label className="field-wrap">
              <span className="field-label">Timezone</span>
              <select className="field-input" {...form.register('timezone')}>
                <option value="America/Los_Angeles">America/Los_Angeles</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </label>
            <label className="field-wrap">
              <span className="field-label">Date Format</span>
              <select className="field-input" {...form.register('dateFormat')}>
                <option value="MMM d, yyyy">MMM d, yyyy</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
              </select>
            </label>
          </div>
        ) : null}

        {activeTab === 'security' ? (
          <div className="settings-grid">
            <label className="field-wrap">
              <span className="field-label">Session Timeout (minutes)</span>
              <input type="number" className="field-input" {...form.register('sessionTimeoutMinutes', { valueAsNumber: true })} />
            </label>
            <label className="switch-row">
              <input type="checkbox" {...form.register('twoFactorEnabled')} />
              <span>Enable Two-Factor Authentication</span>
            </label>
          </div>
        ) : null}

        {activeTab === 'notifications' ? (
          <div className="settings-grid">
            <label className="switch-row">
              <input type="checkbox" {...form.register('emailDigest')} />
              <span>Email Digest</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" {...form.register('inAppAlerts')} />
              <span>In-app Alerts</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" {...form.register('leaveAlerts')} />
              <span>Leave Alerts</span>
            </label>
            <label className="switch-row">
              <input type="checkbox" {...form.register('payrollAlerts')} />
              <span>Payroll Alerts</span>
            </label>
          </div>
        ) : null}

        {activeTab === 'appearance' ? (
          <div className="settings-grid">
            <label className="field-wrap">
              <span className="field-label">Density</span>
              <select className="field-input" {...form.register('density')}>
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </label>
            <label className="field-wrap">
              <span className="field-label">Accent</span>
              <select className="field-input" {...form.register('accent')}>
                <option value="blue">Blue</option>
                <option value="orange">Orange</option>
              </select>
            </label>
          </div>
        ) : null}

        <div className="inline-actions">
          <Button type="submit">Save</Button>
          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              const reset = await settingsService.resetSettings()
              const snapshot = toForm(reset)
              form.reset(snapshot)
              setInitialSnapshot(snapshot)
              push('Settings reset to defaults.', 'info')
            }}
          >
            Reset to Defaults
          </Button>
        </div>
      </form>
    </section>
  )
}
