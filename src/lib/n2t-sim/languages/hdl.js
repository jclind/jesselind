/** Reads and parses HDL chip descriptions. */
import { grammar as ohmGrammar } from "ohm-js";
import { baseSemantics, grammars, makeParser, span } from "./base.js";
import hdlGrammar from "./grammars/hdl.ohm.js";
export const grammar = ohmGrammar(hdlGrammar, grammars);
export const hdlSemantics = grammar.extendSemantics(baseSemantics);
hdlSemantics.addAttribute("SubBus", {
    SubBus(_a, startNode, endNode, _b) {
        const start = startNode.value;
        const end = endNode.child(0)?.child(1)?.value ?? start;
        return { start, end };
    },
});
hdlSemantics.addAttribute("WireSide", {
    WireSide({ name }, index) {
        const { start, end } = index.child(0)?.SubBus ?? {
            start: undefined,
            end: undefined,
        };
        return { pin: name, start, end, span: span(this.source) };
    },
});
hdlSemantics.addAttribute("Wire", {
    Wire(left, _, right) {
        const rhs = right.isTerminal()
            ? { pin: right.sourceString }
            : right.WireSide;
        return { lhs: left.WireSide, rhs };
    },
});
hdlSemantics.addAttribute("Wires", {
    Wires(list) {
        return list.asIteration().children.map((node) => node.Wire);
    },
});
hdlSemantics.addAttribute("Part", {
    Part({ name }, _a, { Wires }, _b, _c) {
        return {
            name: name,
            wires: Wires,
            span: span(this.source),
        };
    },
});
hdlSemantics.addAttribute("Parts", {
    Parts(_, parts) {
        return parts.children.map((c) => c.Part);
    },
    BuiltinPart(_a, _b) {
        return "BUILTIN";
    },
});
hdlSemantics.addAttribute("PartList", {
    PartList(list) {
        return list.Parts;
    },
});
hdlSemantics.addAttribute("Clocked", {
    ClockedList(_a, clocked, _b) {
        return (clocked
            .asIteration()
            .children.map(({ sourceString }) => sourceString) ?? []);
    },
});
hdlSemantics.addAttribute("PinDecl", {
    PinDecl({ name }, width) {
        return {
            pin: name,
            width: width.child(0)?.child(1)?.value ?? 1,
        };
    },
});
hdlSemantics.addAttribute("PinList", {
    PinList(list) {
        return list
            .asIteration()
            .children.map((node) => node.PinDecl);
    },
});
hdlSemantics.addAttribute("Chip", {
    Chip(_a, name, _b, body, _c) {
        return {
            name: { value: name.sourceString, span: span(name.source) },
            ins: body.child(0).child(0)?.child(1)?.PinList ?? [],
            outs: body.child(1).child(0)?.child(1)?.PinList ?? [],
            parts: body.child(2).PartList ?? [],
            clocked: body.child(3).child(0)?.Clocked,
        };
    },
});
hdlSemantics.addAttribute("Root", {
    Root(root) {
        return root.child(0)?.Chip;
    },
});
export const HDL = {
    parser: grammar,
    grammar: hdlGrammar,
    semantics: hdlSemantics,
    parse: makeParser(grammar, hdlSemantics, (n) => n.Chip),
};
//# sourceMappingURL=hdl.js.map