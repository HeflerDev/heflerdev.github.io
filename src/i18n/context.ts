import { createContext, useContext } from 'react'
import type { Locale, Messages } from './types'

export type LocaleContextValue = {
  locale: Locale
  t: Messages
  setLocale: (locale: Locale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
