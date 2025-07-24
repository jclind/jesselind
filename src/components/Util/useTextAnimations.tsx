// hooks/useTextAnimation.ts
import { useRef, useEffect } from 'react'

interface UseTextAnimationOptions {
  threshold?: number
  rootMargin?: string
  visibleClass?: string
}

export const useTextAnimation = (options: UseTextAnimationOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '-10% 0px -10% 0px',
    visibleClass = 'visible',
  } = options

  const elementRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass)
          }
          // Uncomment if you want to remove class when out of view
          // else {
          //   entry.target.classList.remove(visibleClass)
          // }
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

// utils/textAnimationHelpers.ts
export const splitTextToSpans = (
  text: string,
  className: string,
  initialDelay: number = 0
) => {
  return text.split('').map((char, index) => (
    <span
      key={index}
      className={className}
      style={
        {
          animationDelay: `${index * 0.02 + initialDelay}s`,
          '--index': index,
        } as React.CSSProperties
      }
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ))
}
