import { grammar as ohmGrammar } from "ohm-js";
import { baseSemantics, grammars, makeParser, span } from "./base.js";
import jackGrammar from "./grammars/jack.ohm.js";
const primitives = new Set(["int", "boolean", "char"]);
export function isPrimitive(value) {
    return primitives.has(value);
}
export const grammar = ohmGrammar(jackGrammar, grammars);
export const jackSemantics = grammar.extendSemantics(baseSemantics);
function statements(node) {
    return node.children.map((n) => n.statement);
}
jackSemantics.addAttribute("Root", {
    Root(_) {
        return this.class;
    },
});
jackSemantics.addAttribute("class", {
    Class(_a, name, _b, varDecs, subroutines, _c) {
        return {
            name: { value: name.sourceString, span: span(name.source) },
            varDecs: varDecs.children.map((n) => n.classVarDec),
            subroutines: subroutines.children.map((n) => n.subroutineDec),
        };
    },
});
jackSemantics.addAttribute("classVarDec", {
    ClassVarDec(varType, type, name, rest, _) {
        return {
            varType: varType.sourceString.trim(),
            type: {
                value: type.sourceString.trim(),
                span: span(type.source),
            },
            names: [
                name.sourceString,
                ...rest.children.map((n) => n.child(1).sourceString),
            ],
        };
    },
});
jackSemantics.addAttribute("subroutineDec", {
    SubroutineDec(type, returnType, name, _a, parameters, _b, body) {
        return {
            type: type.sourceString.trim(),
            returnType: {
                value: returnType.sourceString.trim(),
                span: span(returnType.source),
            },
            name: { value: name.sourceString, span: span(name.source) },
            parameters: parameters.parameterList,
            body: body.subroutineBody,
        };
    },
});
jackSemantics.addAttribute("parameter", {
    Parameter(type, name) {
        return {
            type: {
                value: type.sourceString.trim(),
                span: span(type.source),
            },
            name: name.sourceString,
        };
    },
});
jackSemantics.addAttribute("parameterList", {
    ParameterList(node) {
        return node.child(0)?.parameters ?? [];
    },
});
jackSemantics.addAttribute("parameters", {
    Parameters(first, rest) {
        return [first.parameter, ...rest.children.map((n) => n.child(1).parameter)];
    },
});
jackSemantics.addAttribute("subroutineBody", {
    SubroutineBody(_a, varDecs, statementList, _b) {
        return {
            varDecs: varDecs.children.map((n) => n.varDec),
            statements: statements(statementList),
        };
    },
});
jackSemantics.addAttribute("varDec", {
    VarDec(_a, type, name, rest, _b) {
        return {
            type: {
                value: type.sourceString.trim(),
                span: span(type.source),
            },
            names: [
                name.sourceString,
                ...rest.children.map((n) => n.child(1).sourceString),
            ],
        };
    },
});
// jackSemantics.addAttribute<string | ArrayAccess>("letTarget", {
//   LetTarget() {
//     jackI
//   }
// })
jackSemantics.addAttribute("statement", {
    LetStatement(_a, target, _b, value, _c) {
        if (target.term.termType == "variable") {
            return {
                statementType: "letStatement",
                name: {
                    value: target.term.name,
                    span: target.term.span,
                },
                value: value.expression,
                span: span(this.source),
            };
        }
        else {
            return {
                statementType: "letStatement",
                name: target.term.name,
                arrayIndex: target.term.index,
                value: value.expression,
                span: span(this.source),
            };
        }
    },
    IfStatement(_a, _b, condition, _c, _d, body, _e, elseBlock) {
        return {
            statementType: "ifStatement",
            condition: condition.expression,
            body: statements(body),
            else: elseBlock.child(0)?.else ?? [],
        };
    },
    WhileStatement(_a, _b, condition, _c, _d, body, _e) {
        return {
            statementType: "whileStatement",
            condition: condition.expression,
            body: statements(body),
        };
    },
    DoStatement(_a, call, _b) {
        return { statementType: "doStatement", call: call.term };
    },
    EmptyReturn(_a, _b) {
        return {
            statementType: "returnStatement",
            span: span(this.source),
        };
    },
    ReturnValue(_a, value, _b) {
        return {
            statementType: "returnStatement",
            value: value.expression,
            span: span(this.source),
        };
    },
});
jackSemantics.addAttribute("else", {
    ElseBlock(_a, _b, body, _c) {
        return statements(body);
    },
});
jackSemantics.addAttribute("term", {
    integerConstant(node) {
        return {
            termType: "numericLiteral",
            value: Number(node.sourceString),
        };
    },
    stringConstant(_a, _b, _c) {
        return { termType: "stringLiteral", value: this.sourceString.slice(1, -1) };
    },
    keywordConstant(_) {
        return {
            termType: "keywordLiteral",
            value: this.sourceString,
        };
    },
    SubroutineCall(name, _a, expressions, _b) {
        return {
            termType: "subroutineCall",
            name: { value: name.sourceString, span: span(name.source) },
            parameters: expressions.expressionList,
            span: span(this.source),
        };
    },
    ArrayAccess(start, index, _) {
        const name = start.child(0);
        return {
            termType: "arrayAccess",
            name: { value: name.sourceString, span: span(name.source) },
            index: index.expression,
            span: span(this.source),
        };
    },
    jackIdentifier(first, rest) {
        return {
            termType: "variable",
            name: `${first.sourceString}${rest.sourceString}`,
            span: span(this.source),
        };
    },
    GroupedExpression(_a, expression, _b) {
        return {
            termType: "groupedExpression",
            expression: expression.expression,
        };
    },
    UnaryExpression(op, term) {
        return {
            termType: "unaryExpression",
            op: op.sourceString,
            term: term.term,
        };
    },
});
jackSemantics.addAttribute("expressionList", {
    ExpressionList(node) {
        return node.child(0)?.expressions ?? [];
    },
});
jackSemantics.addAttribute("expressions", {
    Expressions(first, rest) {
        return [
            first.expression,
            ...rest.children.map((n) => n.child(1).expression),
        ];
    },
});
jackSemantics.addAttribute("expression", {
    Expression(first, rest) {
        return {
            nodeType: "expression",
            term: first.term,
            rest: rest.children.map((n) => n.expressionPart),
        };
    },
});
jackSemantics.addAttribute("expressionPart", {
    ExpressionPart(op, term) {
        return {
            op: op.sourceString,
            term: term.term,
        };
    },
});
export const JACK = {
    parser: grammar,
    grammar: jackGrammar,
    semantics: jackSemantics,
    parse: makeParser(grammar, jackSemantics, (n) => n.class),
};
//# sourceMappingURL=jack.js.map