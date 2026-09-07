import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/AppRouter'
import { DemoBoundary } from './components/app/DemoBoundary'
import { ToastViewport } from './components/ui/ToastViewport'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <DemoBoundary />
          <AppRouter />
          <ToastViewport />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
