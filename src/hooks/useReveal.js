import { useEffect } from 'react'

export function useReveal() {
  useEffect(() => {
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

    const observe = (root) => {
      root.querySelectorAll('[data-reveal]').forEach((el) => obs.observe(el))
    }

    // Observe elements already in the DOM
    observe(document)

    // Pick up [data-reveal] elements added by lazy-loaded sections
    const mutObs = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue
          if (node.matches('[data-reveal]')) obs.observe(node)
          node.querySelectorAll('[data-reveal]').forEach((el) => obs.observe(el))
        }
      }
    })
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      obs.disconnect()
      mutObs.disconnect()
    }
  }, [])
}
