import { Span } from "./base.js";
declare const primitives: Set<"boolean" | "int" | "char">;
export type Primitive = typeof primitives extends Set<infer S> ? S : never;
export declare function isPrimitive(value: string): value is Primitive;
export type Type = Primitive | string;
export interface Class {
    name: {
        value: string;
        span: Span;
    };
    varDecs: ClassVarDec[];
    subroutines: Subroutine[];
}
export type ClassVarType = "static" | "field";
export interface ClassVarDec {
    varType: ClassVarType;
    type: {
        value: Type;
        span: Span;
    };
    names: string[];
}
export interface Parameter {
    type: {
        value: Type;
        span: Span;
    };
    name: string;
}
export type ReturnType = Type | "void";
export type SubroutineType = "constructor" | "function" | "method";
export interface Subroutine {
    type: SubroutineType;
    name: {
        value: string;
        span: Span;
    };
    returnType: {
        value: ReturnType;
        span: Span;
    };
    parameters: Parameter[];
    body: SubroutineBody;
}
export interface SubroutineBody {
    varDecs: VarDec[];
    statements: Statement[];
}
export interface VarDec {
    type: {
        value: Type;
        span: Span;
    };
    names: string[];
}
export type Statement = LetStatement | IfStatement | WhileStatement | DoStatement | ReturnStatement;
export interface LetStatement {
    statementType: "letStatement";
    name: {
        value: string;
        span: Span;
    };
    arrayIndex?: Expression;
    value: Expression;
    span: Span;
}
export interface IfStatement {
    statementType: "ifStatement";
    condition: Expression;
    body: Statement[];
    else: Statement[];
}
export interface WhileStatement {
    statementType: "whileStatement";
    condition: Expression;
    body: Statement[];
}
export interface DoStatement {
    statementType: "doStatement";
    call: SubroutineCall;
}
export interface ReturnStatement {
    statementType: "returnStatement";
    value?: Expression;
    span: Span;
}
export type Op = "+" | "-" | "*" | "/" | "&" | "|" | "<" | ">" | "=";
export type KeywordConstant = "true" | "false" | "null" | "this";
export type UnaryOp = "-" | "~";
export type Term = NumericLiteral | StringLiteral | Variable | KeywordLiteral | SubroutineCall | ArrayAccess | GroupedExpression | UnaryExpression;
export interface NumericLiteral {
    termType: "numericLiteral";
    value: number;
}
export interface StringLiteral {
    termType: "stringLiteral";
    value: string;
}
export interface KeywordLiteral {
    termType: "keywordLiteral";
    value: KeywordConstant;
}
export interface Variable {
    termType: "variable";
    name: string;
    span: Span;
}
export interface GroupedExpression {
    termType: "groupedExpression";
    expression: Expression;
}
export interface UnaryExpression {
    termType: "unaryExpression";
    op: UnaryOp;
    term: Term;
}
export interface ArrayAccess {
    termType: "arrayAccess";
    name: {
        value: string;
        span: Span;
    };
    index: Expression;
    span: Span;
}
export interface SubroutineCall {
    termType: "subroutineCall";
    name: {
        value: string;
        span: Span;
    };
    span: Span;
    parameters: Expression[];
}
export interface ExpressionPart {
    op: Op;
    term: Term;
}
export interface Expression {
    term: Term;
    rest: ExpressionPart[];
}
export declare const grammar: import("ohm-js").Grammar;
export declare const jackSemantics: import("ohm-js").Semantics;
export declare const JACK: {
    parser: import("ohm-js").Grammar;
    grammar: string;
    semantics: import("ohm-js").Semantics;
    parse: (source: string) => import("@davidsouther/jiffies/lib/esm/result.js").Result<Class, import("./base.js").CompilationError>;
};
export {};
