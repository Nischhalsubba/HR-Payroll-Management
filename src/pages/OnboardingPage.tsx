import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

const slides = [
  {
    title: 'Your smart HR platform for work, time, and people.',
    subtitle: 'Manage your team, payroll, and attendance from one place.',
  },
  {
    title: 'Track your time with one tap, anytime, anywhere.',
    subtitle: 'Capture attendance quickly for office, remote, and hybrid teams.',
  },
  {
    title: 'Request and track leave in seconds.',
    subtitle: 'Simple leave approvals and transparent team availability.',
  },
]

export function OnboardingPage() {
  const [active, setActive] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const navigate = useNavigate()
  const { completeOnboarding } = useAuth()

  const isLast = active === slides.length - 1

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setActive((value) => Math.min(value + 1, slides.length - 1))
      }

      if (event.key === 'ArrowLeft') {
        setActive((value) => Math.max(value - 1, 0))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function finish() {
    completeOnboarding()
    navigate('/auth/login')
  }

  return (
    <main className="onboarding-shell">
      <section
        className="phone-frame"
        onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
        onTouchEnd={(event) => {
          if (touchStart === null) {
            return
          }

          const delta = touchStart - (event.changedTouches[0]?.clientX ?? touchStart)
          if (Math.abs(delta) > 40) {
            if (delta > 0) {
              setActive((value) => Math.min(value + 1, slides.length - 1))
            } else {
              setActive((value) => Math.max(value - 1, 0))
            }
          }

          setTouchStart(null)
        }}
      >
        <header className="phone-brand">HRMinds</header>
        <div className="onboarding-slide">
          <h1>{slides[active].title}</h1>
          <p>{slides[active].subtitle}</p>
        </div>

        <div className="onboarding-dots" aria-label="Slide indicator">
          {slides.map((slide, index) => (
            <button
              key={slide.title}
              type="button"
              className={index === active ? 'dot active' : 'dot'}
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="onboarding-actions">
          <Button type="button" variant="ghost" onClick={finish}>
            Skip
          </Button>
          <div className="inline-actions">
            <Button type="button" variant="secondary" onClick={() => setActive((value) => Math.max(0, value - 1))}>
              Back
            </Button>
            {isLast ? (
              <Button type="button" onClick={finish}>
                Get Started
              </Button>
            ) : (
              <Button type="button" onClick={() => setActive((value) => Math.min(slides.length - 1, value + 1))}>
                Next
              </Button>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
