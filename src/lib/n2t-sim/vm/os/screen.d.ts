import { VmMemory } from "../memory.js";
import { OS } from "./os.js";
export type Color = boolean;
export declare const BLACK: Color;
export declare const WHITE: Color;
export declare class ScreenLib {
    private memory;
    private os;
    color: Color;
    constructor(memory: VmMemory, os: OS);
    clear(): void;
    private outOfBounds;
    drawPixel(col: number, row: number): void;
    drawLine(x1: number, y1: number, x2: number, y2: number): void;
    private drawHorizontalLine;
    private drawVerticalLine;
    private drawGeneralLine;
    drawRect(x1: number, y1: number, x2: number, y2: number): void;
    drawCircle(x: number, y: number, r: number): void;
}
