import { useEffect } from 'react'

/**
 * Observes every [data-reveal] element in the document.
 * When an element enters the viewport it receives the `is-visible` class,
 * which triggers the CSS animation defined in index.css.
 * Stagger delay is controlled by the --si CSS custom property (0, 1, 2…)
 * set inline on each element: style={{ '--si': index }}.
 */
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]')
    if (!targets.length) return

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          obs.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -52px 0px' }
    )

    targets.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}
