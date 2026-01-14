import React, { useEffect, useRef, useState } from 'react'

const FRAME_HEIGHT = 600
const FRAME_WIDTH = 600
const NUM_POINTS = 200

type PointType = { x: number; y: number }
// type LineType = {start: PointType, end: PointType}

type Point = { x: number; y: number }
type AnimationStyleType = 'rotate' | 'translate' | 'centerRotate'
type LinesProps = { style?: AnimationStyleType }

function interpolateCurvedPoints(
  originalArr: Point[],
  step: number = 10,
  maxOffset: number = 5
): Point[] {
  const result: Point[] = []

  for (let i = 0; i < originalArr.length - 1; i++) {
    const start = originalArr[i]
    const end = originalArr[i + 1]

    const dx = end.x - start.x
    const dy = end.y - start.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const numPoints = Math.floor(distance / step)

    // Normalize perpendicular vector
    const length = Math.sqrt(dx * dx + dy * dy)
    const perpX = -dy / length
    const perpY = dx / length

    // Always include start point
    result.push(start)

    // Generate interpolated points
    for (let j = 1; j < numPoints; j++) {
      const t = j / numPoints
      const x = start.x + t * dx
      const y = start.y + t * dy

      // Random offset perpendicular to the line
      const offset = (Math.random() * 2 - 1) * maxOffset
      const curveX = x + perpX * offset
      const curveY = y + perpY * offset

      result.push({ x: Math.round(curveX), y: Math.round(curveY) })
    }
  }

  // Add the final endpoint
  result.push(originalArr[originalArr.length - 1])

  return result
}

function biasedRandom(
  bias: number = 0.5,
  strength: number = 2.75,
  exclude: [number, number] = [0.49, 0.51]
): number {
  let value: number

  do {
    // Bias the distribution toward "bias" using a power curve
    let r = Math.random()
    value = bias + (Math.random() - 0.5) * 2 * Math.pow(r, strength)
  } while (value >= exclude[0] && value <= exclude[1])

  // Clamp to [0, 1]
  return Math.min(1, Math.max(0, value))
}

const generatePoints = (
  area: { height: number; width: number },
  numPoints: number
) => {
  const height = area.height
  const width = area.width
  const points: PointType[] = []

  for (let i = 0; i < numPoints; i++) {
    const lastPoint = points[points.length - 1]
    points.push({ x: biasedRandom() * width, y: biasedRandom() * height })
  }

  return points
}
const getDistance = (point1: PointType, point2: PointType) => {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy) // Pythagorean theorem
}

function createRotateAroundMid(
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

function createOscillator(
  startX: number,
  minX: number = 0,
  speed: number = 1
): () => number {
  const maxX = FRAME_WIDTH
  const amplitude = (maxX - minX) / 2
  const midPoint = minX + amplitude
  const startTime = Date.now()

  // Map startX into an angle (0 → 2π)
  const normalized = (startX - midPoint) / amplitude
  const phase = Math.acos(Math.min(1, Math.max(-1, normalized)))
  const baseSpeed = 0.02
  return () => {
    const elapsed = (Date.now() - startTime) / 1000
    const value =
      Math.cos(elapsed * speed * baseSpeed * Math.PI * 2 + phase) * amplitude +
      midPoint
    return value
  }
}
const createTranslator = (
  startX: number,
  minX: number = 0,
  speed: number = 1
) => {
  const startTime = Date.now()

  return () => {
    const elapsed = (Date.now() - startTime) / 10
    const value = startX + elapsed * speed - minX + minX
    return value
  }
}

const Lines = ({ style = 'centerRotate' }: LinesProps) => {
  const [points, setPoints] = useState<PointType[]>([]) // Initialize as empty array
  const translatorsRef = useRef<((() => number) | null)[]>([])
  const oscillatorsRef = useRef<((() => number) | null)[]>([])
  const centerOscillatorRef = useRef<((() => number) | null)[]>([])

  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentSegment, setCurrentSegment] = useState(0)

  const getCurrentSegmentDuration = () => {
    if (currentSegment >= points.length - 1) return 1500

    const segmentStart = points[currentSegment]
    const segmentEnd = points[currentSegment + 1]
    const distance = getDistance(segmentStart, segmentEnd)

    // Constant speed: pixels per millisecond
    const speed = 0.2 // Adjust this value to change overall speed
    return distance / speed
  }

  const getLineState = () => {
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
  const lineState = getLineState()
  const totalSegments = points.length - 1

  useEffect(() => {
    // Generate points when the component mounts
    const initialPoints = interpolateCurvedPoints(
      generatePoints(
        { height: FRAME_HEIGHT / 0.9, width: FRAME_WIDTH / 0.9 },
        NUM_POINTS
      ),
      100
    )
    setPoints(initialPoints)
    setIsAnimating(true) // Start animation

    if (initialPoints.length === 0) return

    let interval: NodeJS.Timer
    if (style === 'rotate') {
      const interval = setInterval(() => {
        setPoints(prevPoints =>
          prevPoints.map((p, i) => {
            const oscillator = oscillatorsRef.current[i]
            if (oscillator) {
              return { ...p, x: oscillator() }
            }
            return p
          })
        )
      }, 80)
      return () => clearInterval(interval)
    } else if (style === 'translate') {
      const interval = setInterval(() => {
        setPoints(prevPoints =>
          prevPoints.map((p, i) => {
            const translator = translatorsRef.current[i]
            if (translator) {
              return { ...p, x: translator() }
            }
            return p
          })
        )
      }, 80)

      return () => clearInterval(interval)
    } else if (style === 'centerRotate') {
      const interval = setInterval(() => {
        setPoints(prevPoints =>
          prevPoints.map((p, i) => {
            const centerOscillator = centerOscillatorRef.current[i]
            if (centerOscillator) {
              return { ...p, x: centerOscillator() }
            }
            return p
          })
        )
      }, 80)

      return () => clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (points.length > 0 && style === 'translate') {
      // give point[0] a translator immediately
      translatorsRef.current[0] = createTranslator(points[0].x, 0, 0.5)
    } else if (points.length > 0 && style === 'rotate') {
      oscillatorsRef.current[0] = createOscillator(points[0].x, 0, 1)
    } else if (points.length > 0 && style === 'centerRotate') {
      centerOscillatorRef.current[0] = createRotateAroundMid(
        points[0].x,
        0,
        FRAME_WIDTH
      )
    }
  }, [points])

  // Animation function
  useEffect(() => {
    if (isAnimating && points.length > 1) {
      const segmentDuration = getCurrentSegmentDuration()
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const totalProgress = elapsed / segmentDuration

        if (totalProgress >= 1 && currentSegment < totalSegments - 1) {
          // segment complete → advance
          setCurrentSegment(prev => {
            const next = prev + 1
            // activate translator for the "next" point
            if (style === 'translate') {
              translatorsRef.current[next] = createTranslator(
                points[next].x,
                0,
                0.5
              )
            } else if (style === 'rotate') {
              oscillatorsRef.current[next] = createOscillator(
                points[next].x,
                0,
                1
              )
            } else if (style === 'centerRotate') {
              centerOscillatorRef.current[next] = createRotateAroundMid(
                points[next].x,
                0,
                FRAME_WIDTH
              )
            }
            return next
          })
          setProgress(0)
        } else if (totalProgress >= 1 && currentSegment === totalSegments - 1) {
          setProgress(1)
          setIsAnimating(false)
        } else {
          setProgress(Math.min(totalProgress, 1))
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [isAnimating, currentSegment, totalSegments])
  if (!lineState || !lineState?.completedSegments) return null

  return (
    <svg width={FRAME_WIDTH} height={FRAME_HEIGHT} className='bg-gray-900'>
      {/* Completed segments */}
      {lineState.completedSegments.map((segment, index) => (
        <line
          key={`completed-${index}`}
          x1={Math.round(segment.start.x)}
          y1={Math.round(segment.start.y)}
          x2={Math.round(segment.end.x)}
          y2={Math.round(segment.end.y)}
          stroke='white'
          strokeWidth='1'
          strokeLinecap='butt'
        />
      ))}

      {/* Current animating segment */}
      {lineState.currentEnd && (
        <line
          x1={lineState.currentEnd.start.x}
          y1={lineState.currentEnd.start.y}
          x2={lineState.currentEnd.currentX}
          y2={lineState.currentEnd.currentY}
          stroke='white'
          strokeWidth='1'
          strokeLinecap='round'
        />
      )}
    </svg>
  )
}

export default Lines
