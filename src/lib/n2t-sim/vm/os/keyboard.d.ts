import { VmMemory } from "../memory.js";
import { OS } from "./os.js";
export declare class KeyboardLib {
    private memory;
    private os;
    private animationFrameId;
    private cancel;
    constructor(memory: VmMemory, os: OS);
    keyPressed(): number;
    private readCharLoop;
    readChar(): void;
    private readLineLoop;
    readLine(messagePointer: number): void;
    readInt(messagePointer: number): void;
    dispose(): void;
}
