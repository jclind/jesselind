import { OS } from "./os.js";
export declare class OutputLib {
    private os;
    private col;
    private row;
    private lastColor;
    constructor(os: OS);
    private setColor;
    private restoreColor;
    clearChar(): void;
    moveCursor(i: number, j: number): void;
    println(): void;
    drawCursor(): void;
    printChar(code: number): void;
    printString(pointer: number): void;
    printJsString(str: string): void;
    printInt(value: number): void;
    backspace(): void;
}
