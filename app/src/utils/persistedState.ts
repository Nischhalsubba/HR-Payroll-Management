export function readCanonicalLocalStorage<T>(
  key: string,
  parse: (value: unknown) => T | null,
  fallback: () => T,
): T {
  const raw = localStorage.getItem(key)

  if (raw) {
    try {
      const parsed = parse(JSON.parse(raw))
      if (parsed !== null) {
        const canonical = JSON.stringify(parsed)
        if (canonical !== raw) {
          localStorage.setItem(key, canonical)
        }
        return parsed
      }
    } catch {
      // Corrupt browser state falls through to the canonical synthetic default.
    }
  }

  const next = fallback()
  localStorage.setItem(key, JSON.stringify(next))
  return next
}
