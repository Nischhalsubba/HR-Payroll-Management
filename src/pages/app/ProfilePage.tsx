import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import * as profileService from '../../services/profileService'
import type { UserProfile } from '../../types/profile'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is required.'),
  email: z.email('Valid email required.'),
  role: z.string().min(2, 'Role is required.'),
  phone: z.string().min(6, 'Phone is required.'),
  location: z.string().min(2, 'Location is required.'),
  bio: z.string().min(10, 'Bio should be descriptive.'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password required.'),
    nextPassword: z.string().min(8, 'Minimum 8 characters.'),
    confirmPassword: z.string().min(8, 'Minimum 8 characters.'),
  })
  .refine((value) => value.nextPassword === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password confirmation does not match.',
  })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

function toInitials(name: string): string {
  const [first = '', second = ''] = name.split(' ')
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase()
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const { signOut } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      role: '',
      phone: '',
      location: '',
      bio: '',
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      nextPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    const load = async () => {
      const data = await profileService.getProfile()
      setProfile(data)
      profileForm.reset(data)
      setLoading(false)
    }

    void load()
  }, [profileForm])

  if (loading || !profile) {
    return <section className="panel status-box">Loading profile...</section>
  }

  return (
    <div className="stack-md profile-page">
      <section className="panel profile-summary">
        <div className="profile-avatar">{profile.avatarLabel || toInitials(profile.fullName)}</div>
        <div className="stack-sm">
          <h1>{profile.fullName}</h1>
          <p>{profile.role}</p>
          <p>{profile.email}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={async () => {
            const updated = await profileService.updateAvatar(toInitials(profile.fullName))
            setProfile(updated)
            push('Profile avatar updated.', 'success')
          }}
        >
          Upload Avatar
        </Button>
      </section>

      <section className="panel stack-md">
        <h2>Personal Information</h2>
        <form
          className="stack-md"
          onSubmit={profileForm.handleSubmit(async (value) => {
            const next = await profileService.updateProfile({
              ...profile,
              ...value,
            })
            setProfile(next)
            push('Profile updated.', 'success')
          })}
        >
          <div className="profile-grid">
            <Field label="Full Name" id="profile-full-name" error={profileForm.formState.errors.fullName?.message} {...profileForm.register('fullName')} />
            <Field label="Email" id="profile-email" error={profileForm.formState.errors.email?.message} {...profileForm.register('email')} />
            <Field label="Role" id="profile-role" error={profileForm.formState.errors.role?.message} {...profileForm.register('role')} />
            <Field label="Phone" id="profile-phone" error={profileForm.formState.errors.phone?.message} {...profileForm.register('phone')} />
            <Field label="Location" id="profile-location" error={profileForm.formState.errors.location?.message} {...profileForm.register('location')} />
          </div>
          <label className="field-wrap">
            <span className="field-label">Bio</span>
            <textarea className="field-input" {...profileForm.register('bio')} />
          </label>
          <div className="inline-actions">
            <Button type="submit">Save Profile</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                profileForm.reset(profile)
                push('Profile form reset.', 'info')
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </section>

      <section className="panel stack-md">
        <h2>Security</h2>
        <form
          className="stack-md"
          onSubmit={passwordForm.handleSubmit(async (value) => {
            await profileService.changePassword(value)
            passwordForm.reset()
            push('Password changed.', 'success')
          })}
        >
          <div className="profile-grid">
            <Field
              label="Current Password"
              id="profile-current-password"
              type="password"
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword')}
            />
            <Field
              label="New Password"
              id="profile-next-password"
              type="password"
              error={passwordForm.formState.errors.nextPassword?.message}
              {...passwordForm.register('nextPassword')}
            />
            <Field
              label="Confirm Password"
              id="profile-confirm-password"
              type="password"
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword')}
            />
          </div>
          <div className="inline-actions">
            <Button type="submit">Change Password</Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                signOut()
                navigate('/auth/login')
              }}
            >
              Sign Out
            </Button>
          </div>
        </form>
      </section>
    </div>
  )
}
