import { useRef, useEffect, type JSX } from 'react'
import styles from './textAnimation.module.scss'

interface UseTextAnimationOptions {
  threshold?: number
  rootMargin?: string
  removeOnExit?: boolean
  visibleClass?: string
}

export const useTextAnimation = (options: UseTextAnimationOptions = {}) => {
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

// utils/textAnimationHelpers.ts
export const splitTextToSpans = (
  text: string,
  className: string = '',
  Tag: keyof JSX.IntrinsicElements = 'p',
  initialDelay: number = 0
) => {
  return (
    <Tag
      className={`${styles.animated_text} ${className}`}
      style={
        {
          '--element-delay': `${initialDelay}s`,
        } as React.CSSProperties
      }
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={styles.letter}
          style={
            {
              animationDelay: `${index * 0.03 + initialDelay}s`,
              '--index': index,
            } as React.CSSProperties
          }
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  )
}
