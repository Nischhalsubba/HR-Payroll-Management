export interface SecuritySettings {
  sessionTimeoutMinutes: number
  twoFactorEnabled: boolean
}

export interface NotificationSettings {
  emailDigest: boolean
  inAppAlerts: boolean
  leaveAlerts: boolean
  payrollAlerts: boolean
}

export interface AppearanceSettings {
  density: 'comfortable' | 'compact'
  accent: 'blue' | 'orange'
}

export interface AppSettings {
  orgName: string
  timezone: string
  dateFormat: 'MMM d, yyyy' | 'dd/MM/yyyy' | 'MM/dd/yyyy'
  security: SecuritySettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
}

