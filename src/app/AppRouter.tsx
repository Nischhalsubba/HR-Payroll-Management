import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardPage } from '../pages/app/DashboardPage'
import { EmployeesPage } from '../pages/app/EmployeesPage'
import { StubSectionPage } from '../pages/app/StubSectionPage'
import { OnboardingPage } from '../pages/OnboardingPage'
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { OtpPage } from '../pages/auth/OtpPage'
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage'
import { SignupPage } from '../pages/auth/SignupPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (user) {
    return <Navigate to="/app/employees" replace />
  }

  return <>{children}</>
}

function HomeRedirect() {
  const { onboardingDone, user } = useAuth()

  if (user) {
    return <Navigate to="/app/employees" replace />
  }

  return <Navigate to={onboardingDone ? '/auth/login' : '/onboarding'} replace />
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route
        path="/onboarding"
        element={
          <GuestRoute>
            <OnboardingPage />
          </GuestRoute>
        }
      />

      <Route
        path="/auth"
        element={
          <GuestRoute>
            <AuthLayout />
          </GuestRoute>
        }
      >
        <Route path="login" element={<LoginPage />} />
        <Route path="sign-up" element={<SignupPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="otp" element={<OtpPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path=":section" element={<StubSectionPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
