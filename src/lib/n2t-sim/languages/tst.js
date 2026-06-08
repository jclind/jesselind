/** Reads tst files to apply and perform test runs. */
import { grammar as ohmGrammar } from "ohm-js";
import { baseSemantics, grammars, makeParser, span } from "./base.js";
import tstGrammar from "./grammars/tst.ohm.js";
export const grammar = ohmGrammar(tstGrammar, grammars);
export const tstSemantics = grammar.extendSemantics(baseSemantics);
tstSemantics.extendAttribute("value", {
    Index(_a, idx, _b) {
        return idx?.child(0)?.value ?? -1;
    },
});
tstSemantics.extendAttribute("name", {
    FileName({ name }) {
        return name;
    },
});
tstSemantics.addAttribute("index", {
    Index(_open, dec, _close) {
        return dec.child(0)?.value ?? 0;
    },
});
tstSemantics.addAttribute("formatSpec", {
    FormatSpec(_a, { sourceString: style }, { value: lpad }, _b, { value: width }, _c, { value: rpad }) {
        return {
            style: style,
            width,
            lpad,
            rpad,
        };
    },
});
tstSemantics.addAttribute("format", {
    OutputFormat({ name: id }, index, formatSpec) {
        return {
            id,
            builtin: index?.child(0) !== undefined,
            address: index?.child(0)?.value ?? -1,
            format: formatSpec?.child(0)?.formatSpec,
        };
    },
});
tstSemantics.addAttribute("operation", {
    TstEvalOperation(op) {
        return { op: op.sourceString };
    },
    TstOutputOperation(_) {
        return { op: "output" };
    },
    TstOutputListOperation(_, formats) {
        return {
            op: "output-list",
            spec: formats.children.map((n) => n.format),
        };
    },
    TstSetOperation(op, { name }, index, { value }) {
        const setOp = {
            op: "set",
            id: name,
            value,
        };
        const child = index.child(0)?.child(1)?.child(0);
        if (child) {
            setOp.index = child.value;
        }
        return setOp;
    },
    TstEchoOperation(op, str) {
        return {
            op: "echo",
            message: str.String,
        };
    },
    TstClearEchoOperation(op) {
        return {
            op: "clear-echo",
        };
    },
    TstLoadROMOperation(_r, _l, name) {
        return {
            op: "loadRom",
            file: name.sourceString,
        };
    },
    TstFileOperation(op, file) {
        return {
            op: op.sourceString,
            file: file?.sourceString,
        };
    },
    TstResetRAMOperation(_) {
        return {
            op: "resetRam",
        };
    },
});
tstSemantics.addAttribute("command", {
    TstCommand(op, sep) {
        return {
            op: op.operation,
            separator: sep.sourceString,
            span: span(this.source),
        };
    },
});
tstSemantics.addAttribute("condition", {
    Condition({ value: left }, { sourceString: op }, { value: right }) {
        return {
            left,
            right,
            op: op,
        };
    },
});
tstSemantics.addAttribute("statement", {
    TstWhile(op, cond, _o, commands, _c) {
        return {
            statements: commands.children.map((node) => node.command),
            condition: cond.condition,
            span: span(this.source),
        };
    },
    TstRepeat(op, count, _o, commands, _c) {
        return {
            statements: commands.children.map((node) => node.command),
            count: count.sourceString ? Number(count.sourceString) : -1,
            span: span(this.source),
        };
    },
    TstStatement(command) {
        return command.command;
    },
});
tstSemantics.addAttribute("tst", {
    Tst(lines) {
        return {
            lines: lines.children.map((n) => n.statement),
        };
    },
});
tstSemantics.addAttribute("root", {
    Root({ tst }) {
        return tst;
    },
});
export const TST = {
    grammar: tstGrammar,
    semantics: tstSemantics,
    parser: grammar,
    parse: makeParser(grammar, tstSemantics),
};
//# sourceMappingURL=tst.js.map