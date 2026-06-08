export default cmp;
declare const cmp: "\nCmp <: Base {\n  Root := line*\n  line = bar cell+ newline?\n  cell = cellvalue bar\n  cellvalue = (~(bar|newline) any)*\n}";
