import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/AppRouter'
import { ToastViewport } from './components/ui/ToastViewport'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRouter />
          <ToastViewport />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
