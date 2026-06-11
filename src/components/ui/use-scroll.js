import { useState, useEffect, useCallback } from 'react'

export function useScroll(threshold) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])

  return scrolled
}
