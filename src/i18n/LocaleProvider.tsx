import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LocaleContext } from './context'
import { detectLocale, persistLocale } from './detect'
import { en } from './en'
import { pt } from './pt'
import type { Locale, Messages } from './types'

const catalogs: Record<Locale, Messages> = { en, pt }

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    persistLocale(next)
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    const description = catalogs[locale].meta.description
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
    const og = document.querySelector('meta[property="og:description"]')
    if (og) og.setAttribute('content', description)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      t: catalogs[locale],
      setLocale,
    }),
    [locale, setLocale],
  )

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  )
}
