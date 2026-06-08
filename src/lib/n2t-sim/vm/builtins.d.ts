import { ReturnType, Subroutine, SubroutineType, Type } from "../languages/jack.js";
import { VmMemory } from "./memory.js";
import { OS } from "./os/os.js";
export type VmBuiltinFunction = (memory: VmMemory, os: OS) => number;
export interface VmBuiltin {
    func: VmBuiltinFunction;
    type: SubroutineType;
    args: Type[];
    returnType: ReturnType;
}
export declare function overridesOsCorrectly(cls: string, subroutine: Subroutine): boolean;
export declare function makeInterface(name: string, builtin: VmBuiltin): string;
export declare const VM_BUILTINS: Record<string, VmBuiltin>;
