import { COMMANDS_OP } from "./alu.js";
import { Memory, MemoryAdapter, MemoryKeyboard } from "./memory.js";
export interface CPUInput {
    inM: number;
    instruction: number;
    reset: boolean;
}
export interface CPUOutput {
    outM: number;
    writeM: boolean;
    addressM: number;
}
export interface CPUState {
    A: number;
    D: number;
    PC: number;
    ALU: number;
    flag: number;
}
export declare function emptyState(): CPUState;
export declare function decode(instruction: number): {
    c: boolean;
    x1: boolean;
    x2: boolean;
    am: boolean;
    op: COMMANDS_OP;
    d1: boolean;
    d2: boolean;
    d3: boolean;
    j1: boolean;
    j2: boolean;
    j3: boolean;
};
export declare function cpuTick({ inM, instruction }: CPUInput, { A, D, PC }: CPUState): [CPUState, boolean, number];
export declare function cpuTock({ inM, instruction, reset }: CPUInput, { A, D, PC, ALU, flag }: CPUState): [CPUOutput, CPUState];
export declare function cpu(input: CPUInput, state: CPUState): [CPUOutput, CPUState];
export declare class CPU {
    #private;
    readonly RAM: Memory;
    readonly ROM: Memory;
    readonly Screen: MemoryAdapter;
    readonly Keyboard: MemoryKeyboard;
    get state(): CPUState;
    get PC(): number;
    get A(): number;
    get D(): number;
    setA(value: number): void;
    setD(value: number): void;
    setPC(value: number): void;
    constructor({ RAM, ROM }: {
        RAM?: Memory;
        ROM: Memory;
    });
    reset(): void;
    tick(): void;
}
