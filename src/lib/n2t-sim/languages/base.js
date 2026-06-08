import { Err, Ok } from "@davidsouther/jiffies/lib/esm/result.js";
import { grammar, } from "ohm-js";
import { int2, int10, int16 } from "../util/twos.js";
import baseGrammar from "./grammars/base.ohm.js";
export const grammars = {
    Base: grammar(baseGrammar),
};
export const baseSemantics = grammars.Base.createSemantics();
baseSemantics.extendOperation("asIteration", {
    List(list, _) {
        return list.asIteration();
    },
});
baseSemantics.addAttribute("value", {
    decNumber(_, digits) {
        return int10(digits.sourceString);
    },
    wholeDec(_, digits) {
        return int10(digits.sourceString);
    },
    binNumber(_, digits) {
        return int2(digits.sourceString);
    },
    hexNumber(_, digits) {
        return int16(digits.sourceString);
    },
    Number(num) {
        return num.value;
    },
    Name(ident) {
        return ident.name;
    },
    identifier(_, __) {
        return this.sourceString;
    },
    _iter(...children) {
        return children.map((c) => c.value);
    },
    _terminal() {
        return this.sourceString;
    },
});
baseSemantics.addAttribute("name", {
    identifier(_, __) {
        return this.sourceString;
    },
    Name(_) {
        return this.child(0)?.name;
    },
});
baseSemantics.addAttribute("String", {
    String(_a, str, _b) {
        return str.sourceString;
    },
});
const UNKNOWN_HDL_ERROR = `HDL statement has a syntax error`;
export function createError(description, span) {
    const match = description.match(/Line \d+, col \d+: (?<message>.*)/);
    const message = match?.groups?.message ? match.groups.message : description;
    return {
        message: `${span?.line != undefined ? `Line ${span.line}: ` : ""}${message}`,
        span: span,
    };
}
export function makeParser(grammar, semantics, property = ({ root }) => root) {
    return function parse(source) {
        try {
            const match = grammar.match(source);
            if (match.failed()) {
                return Err(createError(match.shortMessage ?? UNKNOWN_HDL_ERROR, span(match.getInterval())));
            }
            const parsed = semantics(match);
            const parse = property(parsed);
            return Ok(parse);
        }
        catch (e) {
            return Err(e);
        }
    };
}
export function span(span) {
    return {
        start: span.startIdx,
        end: span.endIdx,
        line: span.getLineAndColumn().lineNum,
    };
}
//# sourceMappingURL=base.js.map