import { useRef } from 'react'

interface OtpInputProps {
  length?: number
  value: string[]
  onChange: (next: string[]) => void
}

export function OtpInput({ length = 6, value, onChange }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const setDigit = (index: number, digit: string) => {
    const next = [...value]
    next[index] = digit
    onChange(next)
  }

  return (
    <div className="otp-row" onPaste={(event) => {
      event.preventDefault()
      const text = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (!text) {
        return
      }

      const next = Array.from({ length }, (_, index) => text[index] ?? '')
      onChange(next)
      refs.current[Math.min(text.length, length) - 1]?.focus()
    }}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          inputMode="numeric"
          maxLength={1}
          className="otp-input"
          value={value[index] ?? ''}
          onChange={(event) => {
            const digit = event.target.value.replace(/\D/g, '').slice(-1)
            setDigit(index, digit)
            if (digit && index < length - 1) {
              refs.current[index + 1]?.focus()
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !value[index] && index > 0) {
              refs.current[index - 1]?.focus()
            }
          }}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
