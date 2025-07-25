import styles from './Contact.module.scss'

// src/utils/textAnimation.ts
export const splitTextToSpans = (
  text: string,
  isTitle: boolean,
  initialDelay: number = 0
) => {
  return text.split('').map((char, index) => (
    <span
      key={index}
      className={styles.letter}
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
