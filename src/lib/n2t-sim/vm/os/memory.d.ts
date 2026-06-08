import { VmMemory } from "../memory.js";
import { OS } from "./os.js";
export declare class MemoryLib {
    private memory;
    private os;
    private freeListPtr;
    constructor(memory: VmMemory, os: OS);
    alloc(size: number): number;
    deAlloc(address: number): void;
}
