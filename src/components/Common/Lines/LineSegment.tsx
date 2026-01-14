import type { PointType } from './types'

type LineSegmentProps = { start: PointType; end: PointType; active?: boolean }

const LineSegment = ({ start, end, active }: LineSegmentProps) => (
  <line
    x1={Math.round(start.x)}
    y1={Math.round(start.y)}
    x2={Math.round(end.x)}
    y2={Math.round(end.y)}
    stroke='white'
    strokeWidth='1'
    strokeLinecap={active ? 'round' : 'butt'}
  />
)

export default LineSegment
