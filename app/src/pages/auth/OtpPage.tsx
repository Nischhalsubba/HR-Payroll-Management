import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { OtpInput } from '../../components/ui/OtpInput'
import { useToast } from '../../context/ToastContext'
import * as authService from '../../services/authService'
import { clearResetContext, loadResetContext, saveResetContext } from '../../utils/storage'

function formatSeconds(value: number): string {
  const minutes = Math.floor(value / 60)
  const seconds = value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function OtpPage() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [digits, setDigits] = useState<string[]>(Array.from({ length: 6 }, () => ''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resendAt, setResendAt] = useState(Date.now() + 30_000)
  const [expiresAt, setExpiresAt] = useState(Date.now() + 120_000)
  const [now, setNow] = useState(Date.now())

  const context = loadResetContext()

  useEffect(() => {
    if (!context) {
      navigate('/auth/forgot-password')
    }
  }, [context, navigate])

  const code = useMemo(() => digits.join(''), [digits])
  const expiresIn = Math.max(0, Math.floor((expiresAt - now) / 1000))
  const resendIn = Math.max(0, Math.floor((resendAt - now) / 1000))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [])

  async function onVerify() {
    if (!context) {
      return
    }

    if (code.length !== 6) {
      setError('Please enter all 6 digits.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const result = await authService.verifyOtp({
        email: context.email,
        requestId: context.requestId,
        code,
      })

      saveResetContext({
        email: context.email,
        requestId: context.requestId,
        resetToken: result.resetToken,
      })

      push('OTP verified.', 'success')
      navigate('/auth/reset-password')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OTP verification failed.'
      setError(message)
      push(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function onResend() {
    if (!context) {
      return
    }

    try {
      const res = await authService.resendOtp(context.requestId)
      setResendAt(Date.now() + 30_000)
      setExpiresAt(res.expiresAt)
      setDigits(Array.from({ length: 6 }, () => ''))
      push('OTP resent. Use 157428.', 'info')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to resend OTP.'
      setError(message)
    }
  }

  if (!context) {
    return null
  }

  return (
    <div className="auth-card narrow">
      <h1>Verify code</h1>
      <p>Enter the 6-digit code sent to {context.email} to continue password reset.</p>

      <div className="stack-md">
        <OtpInput value={digits} onChange={setDigits} />
        <p className="subtle-center">Code expires in {formatSeconds(expiresIn)}</p>
        {error ? <p className="field-message">{error}</p> : null}

        <Button type="button" fullWidth onClick={onVerify} disabled={submitting || expiresIn === 0}>
          {submitting ? 'Verifying...' : 'Verify OTP'}
        </Button>

        <button type="button" className="text-link" onClick={onResend} disabled={resendIn > 0}>
          {resendIn > 0 ? `Resend in ${resendIn}s` : "Didn't get the code? Send Again"}
        </button>

        <button
          type="button"
          className="text-link"
          onClick={() => {
            clearResetContext()
            navigate('/auth/forgot-password')
          }}
        >
          Change email
        </button>
      </div>
    </div>
  )
}
