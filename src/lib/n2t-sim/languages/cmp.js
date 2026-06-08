import { grammar as ohmGrammar } from "ohm-js";
import { baseSemantics, grammars, makeParser } from "./base.js";
import cmpGrammar from "./grammars/cmp.ohm.js";
export const grammar = ohmGrammar(cmpGrammar, grammars);
export const cmpSemantics = grammar.extendSemantics(baseSemantics);
cmpSemantics.addAttribute("cell", {
    cell(value, _) {
        return value.sourceString;
    },
});
cmpSemantics.addAttribute("line", {
    line(_a, cells, _b) {
        return cells.children.map((c) => c.cell);
    },
});
cmpSemantics.addAttribute("root", {
    Root(lines) {
        return lines.children.map((c) => c.line);
    },
});
export const CMP = {
    grammar: cmpGrammar,
    semantics: cmpSemantics,
    parser: grammar,
    parse: makeParser(grammar, cmpSemantics),
};
//# sourceMappingURL=cmp.js.map