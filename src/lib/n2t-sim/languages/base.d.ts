import { Result } from "@davidsouther/jiffies/lib/esm/result.js";
import { type Dict, type Grammar, Interval, type Semantics } from "ohm-js";
export declare const grammars: {
    Base: Grammar;
};
export declare const baseSemantics: Semantics;
export interface CompilationError {
    message: string;
    span?: Span;
}
export declare function createError(description: string, span?: Span): CompilationError;
export declare function makeParser<ResultType>(grammar: Grammar, semantics: Semantics, property?: (obj: Dict) => ResultType): (source: string) => Result<ResultType, CompilationError>;
export interface Span {
    start: number;
    end: number;
    line: number;
}
export declare function span(span: Interval): Span;
