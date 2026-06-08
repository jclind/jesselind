import { Result } from "@davidsouther/jiffies/lib/esm/result.js";
import { ASSIGN_ASM, ASSIGN_OP, COMMANDS_ASM, COMMANDS_OP, JUMP_ASM, JUMP_OP } from "../cpu/alu.js";
import { CompilationError, Span } from "./base.js";
export declare const grammar: import("ohm-js").Grammar;
export declare const asmSemantics: import("ohm-js").Semantics;
export interface Asm {
    instructions: AsmInstruction[];
}
export type AsmInstruction = AsmAInstruction | AsmCInstruction | AsmLabelInstruction;
export type AsmAInstruction = AsmALabelInstruction | AsmAValueInstruction;
export interface AsmALabelInstruction {
    type: "A";
    label: string;
    span?: Span;
}
export interface AsmAValueInstruction {
    type: "A";
    value: number;
    span?: Span;
}
export declare function isAValueInstruction(inst: AsmInstruction): inst is AsmAValueInstruction;
export interface AsmCInstruction {
    type: "C";
    op: COMMANDS_OP;
    isM: boolean;
    store?: ASSIGN_OP;
    jump?: JUMP_OP;
    span?: Span;
}
export interface AsmLabelInstruction {
    type: "L";
    label: string;
    span?: Span;
}
export type Pointer = "R0" | "R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7" | "R8" | "R9" | "R10" | "R11" | "R12" | "R13" | "R14" | "R15" | "SP" | "LCL" | "ARG" | "THIS" | "THAT" | "SCREEN" | "KBD";
export declare function fillLabel(asm: Asm, symbolCallback?: (name: string, value: number, isVar: boolean) => void): Result<void, CompilationError>;
export declare const AsmToString: (inst: AsmInstruction | string) => string;
export declare function translateInstruction(inst: AsmInstruction): number | undefined;
export declare function emit(asm: Asm): number[];
export declare const ASM: {
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parser: import("ohm-js").Grammar;
    parse: (source: string) => Result<Asm, CompilationError>;
    passes: {
        fillLabel: typeof fillLabel;
        emit: typeof emit;
    };
    A: (source: string | number, span?: Span) => AsmAInstruction;
    C: (assign: ASSIGN_ASM, op: COMMANDS_ASM, jmp?: JUMP_ASM, span?: Span) => AsmCInstruction;
    AC: (source: string | number, assign: ASSIGN_ASM, op: COMMANDS_ASM, jmp?: JUMP_ASM) => (AsmAInstruction | AsmCInstruction)[];
    L: (label: string, span?: Span) => AsmLabelInstruction;
};
