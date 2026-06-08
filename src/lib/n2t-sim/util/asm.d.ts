import { ASSIGN, ASSIGN_OP, COMMANDS, COMMANDS_OP, JUMP, JUMP_OP } from "../cpu/alu.js";
export type CommandOps = keyof typeof COMMANDS.op;
export type JumpOps = keyof typeof JUMP.op;
export type StoreOps = keyof typeof ASSIGN.op;
export declare function asm(op: number): string;
export declare function op(asm: string): number;
export declare function makeC(isM: boolean, op: COMMANDS_OP, assign: ASSIGN_OP, jmp: JUMP_OP): number;
