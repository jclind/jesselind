import { Err, Ok, Result } from "@davidsouther/jiffies/lib/esm/result.js";
import { MemoryAdapter, RAM } from "../cpu/memory.js";
import { CompilationError } from "../languages/base.js";
import { Segment, VmInstruction } from "../languages/vm.js";
import { VmMemory } from "./memory.js";
interface VmFrameValues {
    base: number;
    count: number;
    values: number[];
}
export interface VmFrame {
    fn?: VmFunction;
    locals: VmFrameValues;
    args: VmFrameValues;
    stack: VmFrameValues;
    this: VmFrameValues;
    that: VmFrameValues;
    frame: {
        RET: number;
        ARG: number;
        LCL: number;
        THIS: number;
        THAT: number;
    };
    usedSegments?: Set<Segment>;
}
export type VmFunctions = Record<string, VmFunction>;
export interface VmFunction {
    name: string;
    nVars: number;
    labels: Record<string, number>;
    operations: VmInstruction[];
    opBase: number;
}
interface VmFunctionInvocation {
    function: string;
    opPtr: number;
    frameBase: number;
    nArgs: number;
    thisInitialized: boolean;
    thatInitialized: boolean;
    thisN?: number;
}
export declare const IMPLICIT = "__implicit";
export declare const SYS_INIT: VmFunction;
export interface ParsedVmFile {
    name: string;
    instructions: VmInstruction[];
}
interface SegmentStatus {
    initialized: boolean;
    n: number;
}
export declare class Vm {
    memory: VmMemory;
    private os;
    functionMap: Record<string, VmFunction>;
    executionStack: VmFunctionInvocation[];
    entry: string;
    segmentInitializations: Record<"local" | "argument", SegmentStatus>;
    functions: VmFunction[];
    program: VmInstruction[];
    addedSysInit: boolean;
    private staticCount;
    protected statics: Record<string, number[]>;
    getStaticCount(): number;
    private returnLine;
    private registerStatic;
    private registerStatics;
    private static fileBasenameNoExtension;
    private static validateFile;
    private static validateFiles;
    private validateStackInstructions;
    private static validateFunctions;
    static buildFromFiles(files: ParsedVmFile[]): Result<Vm, CompilationError>;
    static build(instructions: VmInstruction[]): Result<Vm, CompilationError>;
    private static buildFunction;
    get RAM(): RAM;
    get Keyboard(): MemoryAdapter;
    get Screen(): MemoryAdapter;
    get invocation(): VmFunctionInvocation;
    get currentFunction(): VmFunction;
    get operation(): VmInstruction | undefined;
    load(instructions: VmInstruction[], reset?: boolean): Result<this, CompilationError>;
    bootstrap(): Err<CompilationError> | Ok<this>;
    reset(): void;
    private validateStackOp;
    setPaused(paused?: boolean): void;
    step(): number | undefined;
    private goto;
    write(addresses: [number, number][]): void;
    read(addresses: number[]): number[];
    vmStack(): VmFrame[];
    private getUsedSegments;
    makeFrame(invocation: VmFunctionInvocation | undefined, nextFrame: number): VmFrame;
    derivedLine(): number;
    writeDebug(): string;
}
export declare function writeFrame(frame: VmFrame): string;
export {};
