declare const commandASMValues: Set<"0" | "1" | "-1" | "D" | "A" | "!D" | "!A" | "-D" | "-A" | "D+1" | "A+1" | "D-1" | "A-1" | "D+A" | "D-A" | "A-D" | "D&A" | "D|A">;
export type COMMANDS_ASM = typeof commandASMValues extends Set<infer S> ? S : never;
export declare function isCommandAsm(command: string): command is COMMANDS_ASM;
export type COMMANDS_OP = 0b101010 | 0b111111 | 0b111010 | 0b001100 | 0b110000 | 0b110000 | 0b001101 | 0b110001 | 0b001111 | 0b110011 | 0b011111 | 0b110111 | 0b001110 | 0b110010 | 0b000010 | 0b010011 | 0b010011 | 0b000111 | 0b000000 | 0b000000 | 0b010101 | 0b010101;
export type COMMANDS_ALU = "0" | "1" | "-1" | "x" | "y" | "!x" | "!y" | "-x" | "-y" | "x+1" | "y+1" | "x-1" | "y-1" | "x+y" | "x-y" | "y-x" | "x&y" | "x|y";
export declare const COMMANDS_ALU: {
    op: Record<COMMANDS_OP, COMMANDS_ALU>;
};
export declare const COMMANDS: {
    asm: Record<COMMANDS_ASM, COMMANDS_OP>;
    op: Record<COMMANDS_OP, COMMANDS_ASM>;
    getOp: (asm: string) => COMMANDS_OP;
};
declare const assignAsmValues: Set<"" | "D" | "A" | "M" | "MD" | "AM" | "AD" | "AMD">;
export type ASSIGN_ASM = typeof assignAsmValues extends Set<infer S> ? S : never;
export type ASSIGN_OP = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare function isAssignAsm(assign: unknown): assign is ASSIGN_ASM;
export declare const ASSIGN: {
    asm: Record<ASSIGN_ASM, ASSIGN_OP>;
    op: Record<ASSIGN_OP, ASSIGN_ASM>;
};
declare const jumpAsmValues: Set<"" | "JGT" | "JEQ" | "JGE" | "JLT" | "JNE" | "JLE" | "JMP">;
export type JUMP_ASM = typeof jumpAsmValues extends Set<infer S> ? S : never;
export type JUMP_OP = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare function isJumpAsm(jump: unknown): jump is JUMP_ASM;
export declare const JUMP: {
    asm: Record<JUMP_ASM, JUMP_OP>;
    op: Record<JUMP_OP, JUMP_ASM>;
};
export declare const Flags: {
    1: string;
    0: string;
    15: string;
    Positive: number;
    Zero: number;
    Negative: number;
};
export declare function alu(op: number, d: number, a: number): [number, number];
export declare function alua(op: number, d: number, a: number): [number, number];
export {};
