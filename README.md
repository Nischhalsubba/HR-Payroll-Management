# AtlasHR - HR Payroll Management (Frontend)

AtlasHR is a React + TypeScript + Vite frontend that implements a design-system-driven HR dashboard experience with full mock-backed flows for onboarding, authentication, employee management, notifications, profile, and settings.

## Tech Stack
- React 19
- TypeScript
- Vite 7
- React Router 7
- React Hook Form + Zod
- Vitest + Testing Library
- Playwright

## Quick Start
1. Install dependencies:
```bash
npm install
```
2. Run local dev server:
```bash
npm run dev
```
3. Open the app:
```text
http://localhost:5173
```

## Scripts
- `npm run dev` - start development server
- `npm run build` - type-check + production build
- `npm run lint` - run ESLint
- `npm run test` - run Vitest in watch mode
- `npm run test:run` - run Vitest once
- `npm run test:e2e` - run Playwright end-to-end suite

## Implemented Flows

### 1. Onboarding
- 3-slide mobile shell onboarding
- `Next`, `Back`, `Skip`, `Get Started`
- Keyboard arrows + touch swipe support

### 2. Authentication
- Login
- Sign-up
- Forgot password -> OTP -> Reset password
- OTP behavior: auto-advance, paste, backspace, countdown + resend

### 3. App Shell and Navigation
- Figma-aligned sidebar labels:
  - `Dashboard`, `Attandence`, `Employees`, `Payroll`, `Payslip`, `Payroll Calendar`, `Report & Analytics`, `Vacancies`, `Applicants`, `Leaves`
  - `Setting`, `Help Center`
- Collapsible desktop sidebar
- Mobile sidebar drawer with overlay
- Search suggestions in top navigation
- Notification bell dropdown with unread badge
- Page transition animations

### 4. Core Pages
- `Employees`: mock CRUD, search/filter/sort, status tabs, pagination, row actions
- `Attandence`: grid/list/detail variants
- `Payroll`: interactive records, filters, actions
- `Notifications`: dropdown + full list + detail view actions
- `Profile`: editable personal info, security/password update, avatar mock update
- `Setting`: tabbed settings with unsaved-change guard, save/reset to defaults
- Remaining sections are interactive stubs (non-dead actions)

## Routes

### Public
- `/onboarding`
- `/auth/login`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/otp`
- `/auth/reset-password`

### Protected
- `/app/dashboard`
- `/app/attandence`
- `/app/attandence/list`
- `/app/attandence/detail/:employeeId`
- `/app/employees`
- `/app/employees/detail/:employeeId`
- `/app/payroll`
- `/app/payslip`
- `/app/payroll-calendar`
- `/app/report-analytics`
- `/app/vacancies`
- `/app/applicants`
- `/app/leaves`
- `/app/setting`
- `/app/help-center`
- `/app/notifications`
- `/app/notifications/:notificationId`
- `/app/profile`

### Legacy Redirects
- `/app/attendance` -> `/app/attandence`
- `/app/attendance/list` -> `/app/attandence/list`
- `/app/attendance/detail/:employeeId` -> `/app/attandence/detail/:employeeId`
- `/app/calendar` -> `/app/payroll-calendar`
- `/app/reports` -> `/app/report-analytics`
- `/app/departments` -> `/app/vacancies`
- `/app/help` -> `/app/help-center`
- `/app/settings` -> `/app/setting`

## Mock Data and Persistence
- Session state persisted in localStorage
- Onboarding completion persisted in localStorage
- Notifications persisted in localStorage
- Profile persisted in localStorage
- Settings persisted in localStorage
- Employees and auth behavior backed by deterministic in-memory/mock services

## Testing
Run all checks:
```bash
npm run lint
npm run build
npm run test:run
npm run test:e2e
```

Current test coverage includes auth reset flow, onboarding flow, and employee CRUD/smoke journeys.
