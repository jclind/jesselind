import { Span } from "./base.js";
export interface PinIndex {
    start?: number | undefined;
    end?: number | undefined;
}
export interface PinParts extends PinIndex {
    pin: string;
    span: Span;
}
export interface PinDeclaration {
    pin: string | string;
    width: number;
}
export interface Wire {
    lhs: PinParts;
    rhs: PinParts;
}
export interface Part {
    name: string;
    wires: Wire[];
    span: Span;
}
export interface HdlParse {
    name: {
        value: string;
        span?: Span;
    };
    ins: PinDeclaration[];
    outs: PinDeclaration[];
    clocked: string[];
    parts: "BUILTIN" | Part[];
}
export declare const grammar: import("ohm-js").Grammar;
export declare const hdlSemantics: import("ohm-js").Semantics;
export declare const HDL: {
    parser: import("ohm-js").Grammar;
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parse: (source: string) => import("@davidsouther/jiffies/lib/esm/result.js").Result<HdlParse, import("./base.js").CompilationError>;
};
