// The nand2tetris abstraction stack, top (the running Jack game) down to the NAND
// primitive. Shared by the architecture visuals on the jack game note page.

export type ArchLayer = {
  name: string
  transform?: string // component list / shorthand (used by older card variants)
  io?: string // clean input → output for this layer (e.g. ".jack → .vm")
  project?: string // nand2tetris project number(s)
  parts?: string // key building blocks inside this layer (used by the tag variant)
  blurb: string // "what it is" — one plain-language sentence
  fact: string // a fun/interesting detail that makes it feel real
  tier: 'app' | 'software' | 'hardware' | 'primitive'
}

// Ordered high abstraction → low abstraction.
export const archLayers: ArchLayer[] = [
  {
    name: 'Jack game',
    transform: 'Player · Boss · Attacks · Stars',
    io: 'keys → pixels',
    project: '9',
    parts: 'Game, Player, Boss, Attack, Star, Node, Util',
    blurb:
      'The game above is written in Jack and was my submission for my nand2tetris project.',
    fact: '≈6,300 VM instructions across 10 classes',
    tier: 'app',
  },
  {
    name: 'Jack Compiler',
    transform: '.jack → .vm',
    io: '.jack → .vm',
    project: '10–11',
    parts: 'tokenizer, parser, symbol table, code gen',
    blurb:
      'Compiles the object oriented Jack language into to stack-based VM code.',
    fact: 'resolves every variable’s scope with a symbol table',
    tier: 'software',
  },
  {
    name: 'VM Translator',
    transform: '.vm → .asm',
    io: '.vm → .asm',
    project: '7–8',
    parts: 'stack arithmetic, memory segments, function calls',
    blurb:
      'Turns the stack-based virtual machine language into Hack assembly code.',
    fact: 'maps 8 virtual memory segments onto one stack',
    tier: 'software',
  },
  {
    name: 'Assembler',
    transform: '.asm → binary',
    io: '.asm → binary',
    project: '6',
    parts: 'parser, symbol table, binary encoding',
    blurb: 'Translates Hack assembly code into 16-bit binary machine code.',
    fact: 'resolves labels in two passes over the source',
    tier: 'software',
  },
  {
    name: 'Operating System',
    transform: 'Math · Memory · Screen · Keyboard · Output',
    io: 'Jack calls → hardware',
    project: '12',
    parts: 'Math, Memory, Screen, Output, Keyboard, String, Array, Sys',
    blurb:
      'A standard library in Jack: graphics, math, memory, strings and I/O. Implements efficiency focused algorithms. ',
    fact: 'multiplies and divides in software — the CPU can’t',
    tier: 'software',
  },
  {
    name: 'Computer',
    transform: 'CPU + Memory + I/O',
    io: 'program → I/O',
    project: '5',
    parts: 'CPU, Memory, ROM32K',
    blurb: 'Wires the CPU to RAM and memory-mapped screen + keyboard.',
    fact: 'the screen is memory-mapped: 8K words at 0x4000',
    tier: 'hardware',
  },
  {
    name: 'CPU',
    transform: 'fetch → decode → execute',
    io: 'fetch → execute',
    project: '5',
    parts: 'ALU, A/D registers, program counter, control',
    blurb:
      'Fetches each instruction and drives the ALU, registers and counter. Takes 16-bit binary instructions and executes them.',
    fact: 'one 16-bit word encodes destination, computation and jump',
    tier: 'hardware',
  },
  {
    name: 'ALU · Registers · RAM',
    transform: 'arithmetic + sequential memory',
    io: 'bits → result',
    project: '2–3',
    parts: 'ALU, Register, PC, RAM8 … RAM16K',
    blurb:
      'The "Arithmetic Logic Unit" which drives me main logical operations of the Hack computer.',
    fact: 'the ALU computes 18 functions from just 6 control bits',
    tier: 'hardware',
  },
  {
    name: 'Logic gates',
    transform: 'And · Or · Not · Mux · Add16',
    io: 'NAND → all logic',
    project: '1–2',
    parts: 'Not, And, Or, Xor, Mux, DMux, Add16, Inc16',
    blurb: 'Every boolean and arithmetic building block of the machine.',
    fact: 'each one is composed purely from NAND',
    tier: 'hardware',
  },
  {
    name: 'NAND',
    transform: 'the universal primitive',
    io: 'a, b → ¬(a·b)',
    parts: 'one gate',
    blurb: 'The most primitive building block of the entire Hack computer.',
    fact: 'functionally complete: the only gate you actually need',
    tier: 'primitive',
  },
]
