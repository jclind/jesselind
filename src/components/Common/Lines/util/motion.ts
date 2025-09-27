import { FRAME_WIDTH } from '../constants'

export function createRotateAroundMid(
  startX: number,
  minX: number = 0,
  maxX: number = FRAME_WIDTH,
  cyclesPerSecond: number = 0.05
): () => number {
  const midPoint = (minX + maxX) / 2
  const amplitude = Math.abs(startX - midPoint) // distance from axis
  const startTime = Date.now()

  // Phase so we start exactly at startX
  const normalized = (startX - midPoint) / amplitude || 0 // handle when amplitude=0
  const phase = amplitude === 0 ? 0 : Math.acos(normalized)

  return () => {
    const elapsed = (Date.now() - startTime) / 1000
    return (
      Math.cos(elapsed * cyclesPerSecond * Math.PI * 2 + phase) * amplitude +
      midPoint
    )
  }
}

export function createOscillator(
  startX: number,
  minX: number = 0,
  speed: number = 1
): () => number {
  const maxX = FRAME_WIDTH
  const amplitude = (maxX - minX) / 2
  const midPoint = minX + amplitude
  const startTime = Date.now()

  const normalized = (startX - midPoint) / amplitude
  const phase = Math.acos(Math.min(1, Math.max(-1, normalized)))
  const baseSpeed = 0.02

  return () => {
    const elapsed = (Date.now() - startTime) / 1000
    return (
      Math.cos(elapsed * speed * baseSpeed * Math.PI * 2 + phase) * amplitude +
      midPoint
    )
  }
}

export function createTranslator(
  startX: number,
  minX: number = 0,
  speed: number = 1
): () => number {
  const startTime = Date.now()
  return () => {
    const elapsed = (Date.now() - startTime) / 10
    return startX + elapsed * speed
  }
}
