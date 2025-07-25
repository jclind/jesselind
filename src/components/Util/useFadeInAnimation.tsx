import { useRef, useEffect, type JSX } from 'react'
import styles from './fadeInAnimation.module.scss'

interface UseFadeInAnimationOptions {
  threshold?: number
  rootMargin?: string
  removeOnExit?: boolean
  visibleClass?: string
}

export const useFadeInAnimation = (options: UseFadeInAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '-10% 0px -10% 0px',
    removeOnExit = false,
    visibleClass = styles.visible,
  } = options

  const elementRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass)
          }

          // Remove class when out of view
          else if (removeOnExit) {
            entry.target.classList.remove(visibleClass)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    elementRefs.current.forEach(element => {
      if (element) observer.observe(element)
    })

    return () => {
      elementRefs.current.forEach(element => {
        if (element) observer.unobserve(element)
      })
    }
  }, [threshold, rootMargin, visibleClass])

  const setRef = (index: number) => (el: HTMLElement | null) => {
    elementRefs.current[index] = el
  }

  return { setRef }
}
