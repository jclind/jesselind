export type Cell = string;
export type Line = Cell[];
export type Cmp = Line[];
export declare const grammar: import("ohm-js").Grammar;
export declare const cmpSemantics: import("ohm-js").Semantics;
export declare const CMP: {
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parser: import("ohm-js").Grammar;
    parse: (source: string) => import("@davidsouther/jiffies/lib/esm/result.js").Result<Cmp, import("./base.js").CompilationError>;
};
