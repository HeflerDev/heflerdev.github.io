import { useEffect, useState } from 'react'

/** True for touch / coarse-pointer devices (phones, many tablets). */
export function useCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(max-width: 768px)').matches
    )
  })

  useEffect(() => {
    const pointerMq = window.matchMedia('(pointer: coarse)')
    const widthMq = window.matchMedia('(max-width: 768px)')
    const sync = () => setCoarse(pointerMq.matches || widthMq.matches)
    sync()
    pointerMq.addEventListener('change', sync)
    widthMq.addEventListener('change', sync)
    return () => {
      pointerMq.removeEventListener('change', sync)
      widthMq.removeEventListener('change', sync)
    }
  }, [])

  return coarse
}
