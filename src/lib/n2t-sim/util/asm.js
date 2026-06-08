import { ASSIGN, COMMANDS, isAssignAsm, isCommandAsm, isJumpAsm, JUMP, } from "../cpu/alu.js";
export function asm(op) {
    if (op & 0x8000) {
        return cInstruction(op);
    }
    return aInstruction(op);
}
function cInstruction(op) {
    op = op & 0xffff; // Clear high order bits
    const mop = (op & 0x1000) >> 12;
    const cop = ((op & 0b0000111111000000) >> 6);
    const sop = ((op & 0b0000000000111000) >> 3);
    const jop = (op & 0b0000000000000111);
    if (COMMANDS.op[cop] === undefined) {
        // Invalid commend
        return "#ERR";
    }
    let command = COMMANDS.op[cop];
    if (mop) {
        command = command.replace(/A/g, "M");
    }
    const store = ASSIGN.op[sop];
    const jump = JUMP.op[jop];
    let instruction = command;
    if (store) {
        instruction = `${store}=${instruction}`;
    }
    if (jump) {
        instruction = `${instruction};${jump}`;
    }
    return instruction;
}
function aInstruction(op) {
    return "@" + (op & 0x7fff).toString(10);
}
export function op(asm) {
    if (asm[0] === "@") {
        return aop(asm);
    }
    else {
        return cop(asm);
    }
}
function aop(asm) {
    return parseInt(asm.substring(1), 10);
}
function cop(asm) {
    const firstPass = asm.match(/(?:(?<assignExists>.+)=)?(.+)(?:;(?<jumpExists>.+))?/);
    const { assignExists, jumpExists } = firstPass?.groups ?? {};
    const parts = asm.match(/(?:(?<assign>[AMD]{1,3})=)?(?<operation>[-+!01ADM&|]{1,3})(?:;(?<jump>JGT|JLT|JGE|JLE|JEQ|JMP))?/);
    let { assign, jump } = parts?.groups ?? {};
    const { operation } = parts?.groups ?? {};
    assign = assign ?? (assignExists ? undefined : "");
    jump = jump ?? (jumpExists ? undefined : "");
    if (parts?.[0] != asm || // match is not exhaustive
        !isAssignAsm(assign) ||
        !isJumpAsm(jump) ||
        !isCommandAsm(operation)) {
        // TODO: This should return Result<> instead of throw
        throw new Error("Invalid c instruction");
    }
    const mode = operation.includes("M");
    const aop = ASSIGN.asm[assign];
    const jop = JUMP.asm[jump];
    const cop = COMMANDS.getOp(operation);
    return makeC(mode, cop, aop, jop);
}
export function makeC(isM, op, assign, jmp) {
    const C = 0xe000;
    const A = isM ? 0x1000 : 0;
    const O = op << 6;
    const D = assign << 3;
    const J = jmp;
    return C + A + O + D + J;
}
//# sourceMappingURL=asm.js.map