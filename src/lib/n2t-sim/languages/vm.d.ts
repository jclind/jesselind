/** Reads tst files to apply and perform test runs. */
import { Span } from "./base.js";
export declare const grammar: import("ohm-js").Grammar;
export declare const vmSemantics: import("ohm-js").Semantics;
export interface Vm {
    instructions: VmInstruction[];
}
export type Segment = "argument" | "local" | "static" | "constant" | "this" | "that" | "pointer" | "temp";
export type VmInstruction = StackInstruction | OpInstruction | FunctionInstruction | CallInstruction | ReturnInstruction | GotoInstruction | LabelInstruction;
export interface StackInstruction {
    op: "push" | "pop";
    segment: Segment;
    offset: number;
    span?: Span;
}
export interface OpInstruction {
    op: "add" | "sub" | "neg" | "lt" | "gt" | "eq" | "and" | "or" | "not";
    span?: Span;
}
export interface FunctionInstruction {
    op: "function";
    name: string;
    nVars: number;
    span?: Span;
}
export interface CallInstruction {
    op: "call";
    name: string;
    nArgs: number;
    span?: Span;
}
export interface ReturnInstruction {
    op: "return";
    span?: Span;
}
export interface LabelInstruction {
    op: "label";
    label: string;
    span?: Span;
}
export interface GotoInstruction {
    op: "goto" | "if-goto";
    label: string;
    span?: Span;
}
export declare const VM: {
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parser: import("ohm-js").Grammar;
    parse: (source: string) => import("@davidsouther/jiffies/lib/esm/result.js").Result<Vm, import("./base.js").CompilationError>;
};
