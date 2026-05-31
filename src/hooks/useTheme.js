import { useEffect, useState } from 'react'

const STORAGE_KEY = 'ironhub-theme'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    return localStorage.getItem(STORAGE_KEY) ?? 'dark'
  })

  useEffect(() => {
    const html = document.documentElement
    html.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => {
    const html = document.documentElement
    html.classList.add('theme-switching')
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
    setTimeout(() => html.classList.remove('theme-switching'), 260)
  }

  return { theme, toggle }
}
