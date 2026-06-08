import { VmMemory } from "../memory.js";
import { OS } from "./os.js";
export declare const NEW_LINE = 128;
export declare const BACKSPACE = 129;
export declare const DOUBLE_QUOTES = 34;
export declare function intToCharArray(value: number): number[];
export declare class StringLib {
    private memory;
    private os;
    constructor(memory: VmMemory, os: OS);
    new(size: number): number;
    dispose(pointer: number): void;
    private maxLength;
    length(pointer: number): number;
    private setLength;
    private charArrayPointer;
    charAt(pointer: number, index: number): number;
    setCharAt(pointer: number, index: number, value: number): void;
    appendChar(pointer: number, value: number): number;
    eraseLastChar(pointer: number): void;
    intValue(pointer: number): number;
    setInt(pointer: number, value: number): void;
}
