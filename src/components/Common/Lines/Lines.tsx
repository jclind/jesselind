import React, { useEffect, useRef, useState } from 'react'
import { FRAME_HEIGHT, FRAME_WIDTH, NUM_POINTS } from './constants'
import type { AnimationStyleType, PointType } from './types'
import {
  generatePoints,
  getCurrentSegmentDuration,
  getDistance,
  getLineState,
  interpolateCurvedPoints,
} from './util/geometry'

import { motionFactories } from './util/motionFactories'

type LinesProps = { style?: AnimationStyleType }

const Lines = ({ style = 'centerRotate' }: LinesProps) => {
  const [points, setPoints] = useState<PointType[]>([]) // Initialize as empty array
  const motionFnsRef = useRef<((() => number) | null)[]>([])

  const [progress, setProgress] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)
  const [currentSegment, setCurrentSegment] = useState(0)

  const lineState = getLineState(points, currentSegment, progress)
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

    const interval = setInterval(() => {
      setPoints(prevPoints =>
        prevPoints.map((p, i) => {
          const motion = motionFnsRef.current[i]
          if (motion) {
            return { ...p, x: motion() }
          }
          return p
        })
      )
    }, 80)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (points.length <= 0) return
    motionFnsRef.current[0] = motionFactories[style](points[0].x)
  }, [points])

  // Animation function
  useEffect(() => {
    if (isAnimating && points.length > 1) {
      const segmentDuration = getCurrentSegmentDuration(points, currentSegment)
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const totalProgress = elapsed / segmentDuration

        if (totalProgress >= 1 && currentSegment < totalSegments - 1) {
          // segment complete → advance
          setCurrentSegment(prev => {
            const next = prev + 1
            // activate translator for the "next" point
            motionFnsRef.current[next] = motionFactories[style](points[next].x)
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
  if (!lineState?.completedSegments) return null

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
