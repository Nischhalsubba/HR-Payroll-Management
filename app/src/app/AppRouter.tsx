import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AppLayout } from '../layouts/AppLayout'
import { AuthLayout } from '../layouts/AuthLayout'
import { AttendancePage } from '../pages/app/AttendancePage'
import { DashboardPage } from '../pages/app/DashboardPage'
import { EmployeesPage } from '../pages/app/EmployeesPage'
import { NotificationsPage } from '../pages/app/NotificationsPage'
import { PayrollPage } from '../pages/app/PayrollPage'
import { ProfilePage } from '../pages/app/ProfilePage'
import { SettingPage } from '../pages/app/SettingPage'
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

function AttendanceLegacyDetailRedirect() {
  const { employeeId = '' } = useParams()
  return <Navigate to={`/app/attandence/detail/${employeeId}`} replace />
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
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="attandence" element={<AttendancePage view="grid" />} />
        <Route path="attandence/list" element={<AttendancePage view="list" />} />
        <Route path="attandence/detail/:employeeId" element={<AttendancePage view="detail" />} />
        <Route path="employees" element={<EmployeesPage view="grid" />} />
        <Route path="employees/detail/:employeeId" element={<EmployeesPage view="detail" />} />
        <Route path="payroll" element={<PayrollPage />} />
        <Route path="notifications" element={<NotificationsPage view="list" />} />
        <Route path="notifications/:notificationId" element={<NotificationsPage view="detail" />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="setting" element={<SettingPage />} />

        <Route path="help-center" element={<StubSectionPage />} />
        <Route path="payslip" element={<StubSectionPage />} />
        <Route path="payroll-calendar" element={<StubSectionPage />} />
        <Route path="report-analytics" element={<StubSectionPage />} />
        <Route path="vacancies" element={<StubSectionPage />} />
        <Route path="applicants" element={<StubSectionPage />} />
        <Route path="leaves" element={<StubSectionPage />} />

        <Route path="attendance" element={<Navigate to="/app/attandence" replace />} />
        <Route path="attendance/list" element={<Navigate to="/app/attandence/list" replace />} />
        <Route path="attendance/detail/:employeeId" element={<AttendanceLegacyDetailRedirect />} />
        <Route path="calendar" element={<Navigate to="/app/payroll-calendar" replace />} />
        <Route path="reports" element={<Navigate to="/app/report-analytics" replace />} />
        <Route path="departments" element={<Navigate to="/app/vacancies" replace />} />
        <Route path="help" element={<Navigate to="/app/help-center" replace />} />
        <Route path="settings" element={<Navigate to="/app/setting" replace />} />

        <Route path=":section" element={<StubSectionPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
