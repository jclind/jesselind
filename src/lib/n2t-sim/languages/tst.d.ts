/** Reads tst files to apply and perform test runs. */
import { Span } from "./base.js";
export interface TstEchoOperation {
    op: "echo";
    message: string;
}
export interface TstClearEchoOperation {
    op: "clear-echo";
}
export interface TstSetOperation {
    op: "set";
    id: string;
    index?: number;
    value: number;
}
export interface TstEvalOperation {
    op: "eval" | "tick" | "tock" | "ticktock" | "vmstep";
}
export interface TstOutputOperation {
    op: "output";
}
export interface TstOutputFormat {
    style: "D" | "X" | "B" | "S";
    width: number;
    lpad: number;
    rpad: number;
}
export interface TstOutputSpec {
    id: string;
    builtin: boolean;
    address: number;
    format?: TstOutputFormat;
}
export interface TstOutputListOperation {
    op: "output-list";
    spec: TstOutputSpec[];
}
export interface TstLoadROMOperation {
    op: "loadRom";
    file: string;
}
export interface TstFileOperation {
    op: "load" | "output-file" | "compare-to";
    file?: string;
}
export interface TstResetRamOperation {
    op: "resetRam";
}
export type TstOperation = TstFileOperation | TstEvalOperation | TstEchoOperation | TstClearEchoOperation | TstOutputOperation | TstSetOperation | TstOutputListOperation | TstLoadROMOperation | TstResetRamOperation;
export type Separator = "," | ";" | "!";
export interface TstCommand {
    op: TstOperation;
    separator: Separator;
    span: Span;
}
export interface TstRepeat {
    statements: TstCommand[];
    count: number;
    span: Span;
}
export interface TstWhileCondition {
    op: "<" | "<=" | "=" | ">=" | ">" | "<>";
    left: string | number;
    right: string | number;
}
export interface TstWhileStatement {
    statements: TstCommand[];
    condition: TstWhileCondition;
    span: Span;
}
export type TstStatement = TstCommand | TstRepeat | TstWhileStatement;
export interface Tst {
    lines: TstStatement[];
}
export declare const grammar: import("ohm-js").Grammar;
export declare const tstSemantics: import("ohm-js").Semantics;
export declare const TST: {
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parser: import("ohm-js").Grammar;
    parse: (source: string) => import("@davidsouther/jiffies/lib/esm/result.js").Result<Tst, import("./base.js").CompilationError>;
};
