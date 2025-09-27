// motionFactories.ts
import {
  createTranslator,
  createOscillator,
  createRotateAroundMid,
} from './motion'
import { FRAME_WIDTH } from '../constants'

export const motionFactories = {
  translate: (x: number) => createTranslator(x, 0, 0.3),
  rotate: (x: number) => createOscillator(x, 0, 1),
  centerRotate: (x: number) => createRotateAroundMid(x, 0, FRAME_WIDTH),
}
