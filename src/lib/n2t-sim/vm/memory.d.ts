import { Result } from "@davidsouther/jiffies/lib/esm/result.js";
import { RAM } from "../cpu/memory.js";
import { Segment } from "../languages/vm.js";
import { VmFrame } from "./vm.js";
export declare const SP = 0;
export declare const LCL = 1;
export declare const ARG = 2;
export declare const THIS = 3;
export declare const THAT = 4;
export declare const TEMP = 5;
export declare const STATIC = 16;
export declare class VmMemory extends RAM {
    strict: boolean;
    get SP(): number;
    set SP(value: number);
    get LCL(): number;
    set LCL(value: number);
    get ARG(): number;
    set ARG(value: number);
    get THIS(): number;
    set THIS(value: number);
    get THAT(): number;
    set THAT(value: number);
    get statics(): number[];
    constructor();
    baseSegment(segment: Segment, offset: number): Result<number, Error>;
    getSegment(segment: Segment, offset: number): number;
    setSegment(segment: Segment, offset: number, value: number): void;
    argument(offset: number): number;
    local(offset: number): number;
    static(offset: number): number;
    constant(offset: number): number;
    this(offset: number): number;
    that(offset: number): number;
    pointer(offset: number): number;
    temp(offset: number): number;
    push(value: number): void;
    pop(): number;
    pushFrame(ret: number, nArgs: number, nLocals: number): number;
    popFrame(): number;
    getFrame(base: number, // The address of the frame, the RET address
    argN: number, // The number of arguments to this frame
    localN: number, // The number of locals in this frame
    thisN: number, // The number of items in `this`
    thatN: number, // the number of items in `that`
    nextFrame: number): VmFrame;
    getVmState(staticN?: number): {
        "0: SP": number;
        "1: LCL": number;
        "2: ARG": number;
        "3: THIS": number;
        "4: THAT": number;
        temps: number[];
        internal: number[];
        static: number[];
    };
    binOp(fn: (a: number, b: number) => number): void;
    unOp(fn: (a: number) => number): void;
    comp(fn: (a: number, b: number) => boolean): void;
}
