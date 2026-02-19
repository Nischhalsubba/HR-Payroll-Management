export interface UserProfile {
  fullName: string
  email: string
  role: string
  phone: string
  location: string
  bio: string
  avatarLabel: string
}

export interface PasswordChangeInput {
  currentPassword: string
  nextPassword: string
  confirmPassword: string
}

