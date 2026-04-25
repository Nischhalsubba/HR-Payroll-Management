<div align="center">

# AtlasHR — HR Payroll Management Frontend

### Design-System-Driven HR Dashboard Experience

**A React + TypeScript + Vite frontend for an HR and payroll management product, featuring onboarding, authentication, employee management, attendance, payroll, notifications, profile, settings, mock persistence, and tested user flows.**

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=111111)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/Router-React%20Router%207-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)

</div>

---

## ✨ Overview

**AtlasHR** is a frontend prototype for an HR Payroll Management product. It implements a design-system-driven dashboard experience with realistic mock-backed flows for onboarding, authentication, employee management, attendance, payroll, notifications, profile, settings, and protected app navigation.

The project is built with React 19, TypeScript, Vite 7, React Router 7, React Hook Form, Zod, Vitest, Testing Library, and Playwright.

This repo is useful as a strong frontend case study because it shows more than static screens. It includes real interaction patterns, route protection, local persistence, mock services, form validation, CRUD-like flows, and test coverage for important user journeys.

---

## 🧭 Table of Contents

- [Product Purpose](#-product-purpose)
- [Designer’s Perspective](#-designers-perspective)
- [Tech Stack](#-tech-stack)
- [Implemented Flows](#-implemented-flows)
- [Routes](#-routes)
- [Mock Data and Persistence](#-mock-data-and-persistence)
- [Design System Direction](#-design-system-direction)
- [Testing](#-testing)
- [Quick Start](#-quick-start)
- [Scripts](#-scripts)
- [Quality Checklist](#-quality-checklist)
- [Roadmap](#-roadmap)

---

## 🎯 Product Purpose

AtlasHR is designed to simulate the core frontend experience of a modern HR and payroll system.

The product supports common HR workflows such as:

- employee onboarding
- login and account recovery
- dashboard navigation
- employee records
- attendance tracking
- payroll records
- notifications
- profile editing
- settings management

The goal is to make HR operations feel organized, predictable, and easy to navigate.

---

## 🎨 Designer’s Perspective

This project is written from the perspective of a product designer who understands frontend implementation.

An HR/payroll system should not feel like a collection of random admin pages. It should feel like one connected operational workspace.

The most important UX goals are:

- clear navigation
- predictable page structure
- readable employee data
- fast access to payroll/attendance sections
- visible notifications
- simple profile/settings management
- strong form validation
- helpful empty states
- mock flows that behave like real product flows

The app also keeps the original Figma-aligned navigation wording, including the intentionally spelled `Attandence` route/label, while adding legacy redirects for corrected/common routes.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| UI | React `19.2.0` | Component-based frontend |
| Language | TypeScript `5.9.x` | Type-safe app logic |
| Build Tool | Vite `7.3.x` | Fast development and production builds |
| Routing | React Router DOM `7.13.0` | Public/protected route structure |
| Forms | React Hook Form | Form state and validation integration |
| Validation | Zod | Schema-based form validation |
| Unit Testing | Vitest | Component and logic tests |
| UI Testing | Testing Library | User-focused component tests |
| E2E Testing | Playwright | Browser-level flow testing |
| Linting | ESLint | Code quality |

---

## 🧩 Implemented Flows

### 1. Onboarding

- 3-slide mobile shell onboarding
- `Next`, `Back`, `Skip`, `Get Started`
- Keyboard arrow support
- Touch swipe support
- Onboarding completion persisted in localStorage

### 2. Authentication

- Login
- Sign-up
- Forgot password
- OTP verification
- Reset password
- OTP auto-advance
- OTP paste handling
- OTP backspace behavior
- Countdown + resend behavior

### 3. App Shell and Navigation

Figma-aligned sidebar labels:

| Main Navigation | Secondary Navigation |
|---|---|
| Dashboard | Setting |
| Attandence | Help Center |
| Employees |  |
| Payroll |  |
| Payslip |  |
| Payroll Calendar |  |
| Report & Analytics |  |
| Vacancies |  |
| Applicants |  |
| Leaves |  |

Shell behavior includes:

- collapsible desktop sidebar
- mobile sidebar drawer with overlay
- search suggestions in top navigation
- notification bell dropdown with unread badge
- page transition animations

### 4. Core Pages

| Page | Implemented Behavior |
|---|---|
| Employees | Mock CRUD, search/filter/sort, status tabs, pagination, row actions |
| Attandence | Grid/list/detail variants |
| Payroll | Interactive records, filters, actions |
| Notifications | Dropdown + full list + detail view actions |
| Profile | Editable personal info, security/password update, avatar mock update |
| Setting | Tabbed settings with unsaved-change guard, save/reset defaults |
| Remaining sections | Interactive stubs with non-dead actions |

---

## 🧭 Routes

### Public Routes

| Route | Purpose |
|---|---|
| `/onboarding` | First-time onboarding flow |
| `/auth/login` | Login screen |
| `/auth/sign-up` | Sign-up screen |
| `/auth/forgot-password` | Forgot password request |
| `/auth/otp` | OTP verification |
| `/auth/reset-password` | Reset password screen |

### Protected Routes

| Route | Purpose |
|---|---|
| `/app/dashboard` | Main dashboard |
| `/app/attandence` | Attendance overview |
| `/app/attandence/list` | Attendance list view |
| `/app/attandence/detail/:employeeId` | Attendance detail |
| `/app/employees` | Employee management |
| `/app/employees/detail/:employeeId` | Employee detail |
| `/app/payroll` | Payroll records |
| `/app/payslip` | Payslip section |
| `/app/payroll-calendar` | Payroll calendar |
| `/app/report-analytics` | Reports and analytics |
| `/app/vacancies` | Vacancies section |
| `/app/applicants` | Applicants section |
| `/app/leaves` | Leaves section |
| `/app/setting` | Settings |
| `/app/help-center` | Help center |
| `/app/notifications` | Notifications list |
| `/app/notifications/:notificationId` | Notification detail |
| `/app/profile` | User profile |

### Legacy Redirects

| Legacy Route | Redirects To |
|---|---|
| `/app/attendance` | `/app/attandence` |
| `/app/attendance/list` | `/app/attandence/list` |
| `/app/attendance/detail/:employeeId` | `/app/attandence/detail/:employeeId` |
| `/app/calendar` | `/app/payroll-calendar` |
| `/app/reports` | `/app/report-analytics` |
| `/app/departments` | `/app/vacancies` |
| `/app/help` | `/app/help-center` |
| `/app/settings` | `/app/setting` |

---

## 💾 Mock Data and Persistence

The project uses mock-backed behavior to simulate a real HR product.

Persisted in `localStorage`:

- session state
- onboarding completion
- notifications
- profile
- settings

Mock/in-memory flows:

- employee behavior
- auth behavior
- deterministic service responses

This makes the prototype feel interactive without requiring a backend.

---

## 🎨 Design System Direction

AtlasHR is designed as an operational dashboard, so the design should prioritize:

- clear sidebar hierarchy
- readable tables
- helpful filters
- consistent forms
- predictable action placement
- accessible modal/drawer behavior
- visible status badges
- friendly validation states
- responsive management screens

The interface should feel calm and structured because HR and payroll workflows involve sensitive employee information and repeated daily operations.

---

## 🧪 Testing

Run all major checks:

```bash
npm run lint
npm run build
npm run test:run
npm run test:e2e
```

Current test coverage includes:

- auth reset flow
- onboarding flow
- employee CRUD/smoke journeys

Recommended future test coverage:

- settings unsaved-change guard
- notification read/unread behavior
- mobile sidebar drawer behavior
- protected route redirects
- payroll filter interactions
- profile edit validation

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run local dev server

```bash
npm run dev
```

### 3. Open the app

```text
http://localhost:5173
```

---

## 📜 Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and create production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run Vitest once |
| `npm run test:e2e` | Run Playwright end-to-end tests |

---

## ✅ Quality Checklist

### UX QA

- [ ] Onboarding works with click, keyboard, and swipe.
- [ ] Auth screens have clear errors and validation.
- [ ] OTP interaction supports typing, paste, backspace, and resend.
- [ ] Sidebar collapse/expand works.
- [ ] Mobile drawer works with overlay.
- [ ] Employee table supports search, filter, sort, and pagination.
- [ ] Settings warn about unsaved changes.
- [ ] Notifications show read/unread state clearly.

### Technical QA

- [ ] `npm install` works.
- [ ] `npm run dev` works.
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` passes or known issues are documented.
- [ ] `npm run test:run` passes.
- [ ] `npm run test:e2e` passes.
- [ ] localStorage reset does not break the app.

### Design QA

- [ ] Dashboard layout feels balanced.
- [ ] Tables are readable on common laptop widths.
- [ ] Mobile screens are usable.
- [ ] Buttons and forms have consistent spacing.
- [ ] Status badges are understandable.
- [ ] Empty states are helpful.

---

## 🗺 Roadmap

- Connect to a real backend API.
- Add role-based permissions.
- Add real payroll calculation logic.
- Add attendance import/export.
- Add employee document management.
- Add richer reports and analytics charts.
- Add audit logs for sensitive actions.
- Add stronger accessibility coverage.
- Add production-ready auth/token handling.

---

<div align="center">

Built as a polished HR dashboard frontend prototype with real interaction depth, not just static screens.

</div>
