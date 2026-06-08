import { unwrap } from "@davidsouther/jiffies/lib/esm/result.js";
import { ASM } from "./languages/asm.js";
import { int2, parseTwosInt } from "./util/twos.js";
export async function loadAsm(source) {
    const asm = unwrap(ASM.parse(source));
    ASM.passes.fillLabel(asm);
    return ASM.passes.emit(asm);
}
export async function loadHack(source) {
    return source
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map(int2);
}
export function loadHackSync(source) {
    return source
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map(int2);
}
export async function loadBlob(bytes) {
    return bytes
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map(parseTwosInt);
}
//# sourceMappingURL=loader.js.map