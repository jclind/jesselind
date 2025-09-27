import type { PointType } from '../types'

export function interpolateCurvedPoints(
  originalArr: PointType[],
  step: number = 10,
  maxOffset: number = 5
): PointType[] {
  const result: PointType[] = []
  for (let i = 0; i < originalArr.length - 1; i++) {
    const start = originalArr[i]
    const end = originalArr[i + 1]

    const dx = end.x - start.x
    const dy = end.y - start.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const numPoints = Math.floor(distance / step)

    const length = Math.sqrt(dx * dx + dy * dy)
    const perpX = -dy / length
    const perpY = dx / length

    result.push(start)
    for (let j = 1; j < numPoints; j++) {
      const t = j / numPoints
      const x = start.x + t * dx
      const y = start.y + t * dy
      const offset = (Math.random() * 2 - 1) * maxOffset
      result.push({
        x: Math.round(x + perpX * offset),
        y: Math.round(y + perpY * offset),
      })
    }
  }
  result.push(originalArr[originalArr.length - 1])
  return result
}

export function biasedRandom(
  bias: number = 0.5,
  strength: number = 2.75,
  exclude: [number, number] = [0.49, 0.51]
): number {
  let value: number
  do {
    let r = Math.random()
    value = bias + (Math.random() - 0.5) * 2 * Math.pow(r, strength)
  } while (value >= exclude[0] && value <= exclude[1])
  return Math.min(1, Math.max(0, value))
}

export function getDistance(a: PointType, b: PointType) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

// export const generatePoints = (
//   width: number,
//   height: number,
//   numPoints: number
// ): Point[] =>
//   Array.from({ length: numPoints }, () => ({
//     x: biasedRandom() * width,
//     y: biasedRandom() * height,
//   }))

export const generatePoints = (
  area: { height: number; width: number },
  numPoints: number
) => {
  const height = area.height
  const width = area.width
  const points: PointType[] = []

  for (let i = 0; i < numPoints; i++) {
    if (i === 0 || i === numPoints - 1) {
      points.push({
        x: biasedRandom(0.5, 100, [0.499999, 0.5000000001]) * width,
        y: height / 2,
      })
      continue
    }
    points.push({ x: biasedRandom() * width, y: biasedRandom() * height })
  }

  return points
}

export const getCurrentSegmentDuration = (
  points: PointType[],
  currentSegment: number
) => {
  if (currentSegment >= points.length - 1) return 1500

  const segmentStart = points[currentSegment]
  const segmentEnd = points[currentSegment + 1]
  const distance = getDistance(segmentStart, segmentEnd)

  // Constant speed: pixels per millisecond
  const speed = 0.2 // Adjust this value to change overall speed
  return distance / speed
}

export const getLineState = (
  points: PointType[],
  currentSegment: number,
  progress: number
) => {
  if (points.length < 2) return { segments: [], currentEnd: null }

  const completedSegments = []
  let currentEnd = null

  // Add all completed segments
  for (let i = 0; i < currentSegment && i < points.length - 1; i++) {
    completedSegments.push({
      start: points[i],
      end: points[i + 1],
    })
  }

  // Calculate current animating segment
  if (currentSegment < points.length - 1) {
    const segmentStart = points[currentSegment]
    const segmentEnd = points[currentSegment + 1]

    const currentEndX =
      segmentStart.x + (segmentEnd.x - segmentStart.x) * progress
    const currentEndY =
      segmentStart.y + (segmentEnd.y - segmentStart.y) * progress

    currentEnd = {
      start: segmentStart,
      currentX: currentEndX,
      currentY: currentEndY,
    }
  }

  return { completedSegments, currentEnd }
}
