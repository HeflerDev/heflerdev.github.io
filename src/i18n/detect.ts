import type { Locale } from './types'

const STORAGE_KEY = 'hefler-locale'

export function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'pt') return stored
  } catch {
    // ignore
  }

  const candidates = [
    navigator.language,
    ...(navigator.languages ?? []),
  ]
    .filter(Boolean)
    .map((l) => l.toLowerCase())

  if (candidates.some((l) => l.startsWith('pt'))) return 'pt'
  return 'en'
}

export function persistLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale)
  } catch {
    // ignore
  }
}
