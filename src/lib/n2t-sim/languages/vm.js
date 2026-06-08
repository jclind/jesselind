/** Reads tst files to apply and perform test runs. */
import { grammar as ohmGrammar } from "ohm-js";
import { baseSemantics, grammars, makeParser, span } from "./base.js";
import vmGrammar from "./grammars/vm.ohm.js";
export const grammar = ohmGrammar(vmGrammar, grammars);
export const vmSemantics = grammar.extendSemantics(baseSemantics);
vmSemantics.addAttribute("op", {
    push(_a, _b) {
        return "push";
    },
    pop(_a, _b) {
        return "pop";
    },
    function(_a, _b) {
        return "function";
    },
    call(_a, _b) {
        return "call";
    },
    return(_a) {
        return "return";
    },
    goto(_a, _b) {
        return "goto";
    },
    ifGoto(_a, _b) {
        return "if-goto";
    },
    label(_a, _b) {
        return "label";
    },
    Add(_) {
        return "add";
    },
    Sub(_) {
        return "sub";
    },
    Neg(_) {
        return "neg";
    },
    Eq(_) {
        return "eq";
    },
    Lt(_) {
        return "lt";
    },
    Gt(_) {
        return "gt";
    },
    And(_) {
        return "and";
    },
    Or(_) {
        return "or";
    },
    Not(_) {
        return "not";
    },
});
vmSemantics.addAttribute("segment", {
    argument(_a, _b) {
        return "argument";
    },
    local(_a, _b) {
        return "local";
    },
    static(_a, _b) {
        return "static";
    },
    constant(_a, _b) {
        return "constant";
    },
    this(_a, _b) {
        return "this";
    },
    that(_a, _b) {
        return "that";
    },
    pointer(_a, _b) {
        return "pointer";
    },
    temp(_a, _b) {
        return "temp";
    },
});
vmSemantics.addAttribute("instruction", {
    StackInstruction({ op }, { segment }, value) {
        return {
            op: op,
            segment,
            offset: Number(value.sourceString),
            span: span(this.source),
        };
    },
    OpInstruction({ op }) {
        return {
            op: op,
            span: span(this.source),
        };
    },
    FunctionInstruction(_, { name }, nVars) {
        return {
            op: "function",
            name,
            nVars: Number(nVars.sourceString),
            span: span(this.source),
        };
    },
    CallInstruction(_, { name }, nArgs) {
        return {
            op: "call",
            name,
            nArgs: Number(nArgs.sourceString),
            span: span(this.source),
        };
    },
    ReturnInstruction(_) {
        return { op: "return", span: span(this.source) };
    },
    // LabelInstruction = Label Name
    LabelInstruction(_, { name: label }) {
        return { op: "label", label, span: span(this.source) };
    },
    // GotoInstruction = (Goto | IfGoto) Name
    GotoInstruction({ op }, { name: label }) {
        return {
            op: op,
            label,
            span: span(this.source),
        };
    },
    VmInstructionLine(inst, _) {
        return inst.instruction;
    },
});
vmSemantics.addAttribute("vm", {
    Vm(_, lines, last) {
        const instructions = lines.children.map((node) => node.instruction) ?? [];
        return {
            instructions: last.child(0)
                ? [...instructions, last.child(0).instruction]
                : instructions,
        };
    },
});
vmSemantics.addAttribute("root", {
    Root({ vm }) {
        return vm;
    },
});
export const VM = {
    grammar: vmGrammar,
    semantics: vmSemantics,
    parser: grammar,
    parse: makeParser(grammar, vmSemantics),
};
//# sourceMappingURL=vm.js.map