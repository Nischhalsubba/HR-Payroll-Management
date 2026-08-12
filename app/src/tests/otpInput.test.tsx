import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { OtpInput } from '../components/ui/OtpInput'

describe('OtpInput', () => {
  it('auto advances when digit typed', () => {
    const onChange = vi.fn()
    render(<OtpInput value={['', '', '', '', '', '']} onChange={onChange} />)

    const first = screen.getByLabelText('OTP digit 1')
    fireEvent.change(first, { target: { value: '1' } })

    expect(onChange).toHaveBeenCalledWith(['1', '', '', '', '', ''])
  })

  it('supports paste for whole code', () => {
    const onChange = vi.fn()
    render(<OtpInput value={['', '', '', '', '', '']} onChange={onChange} />)

    const wrapper = screen.getByLabelText('OTP digit 1').parentElement
    if (!wrapper) {
      throw new Error('Wrapper not found')
    }

    fireEvent.paste(wrapper, {
      clipboardData: {
        getData: () => '157428',
      },
    })

    expect(onChange).toHaveBeenCalledWith(['1', '5', '7', '4', '2', '8'])
  })
})
