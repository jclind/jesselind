import { assert } from "@davidsouther/jiffies/lib/esm/assert.js";
import { load } from "../fs.js";
import { op } from "../util/asm.js";
import { int2, int10, int16 } from "../util/twos.js";
export const FORMATS = ["bin", "dec", "hex", "asm"];
export const SCREEN_OFFSET = 0x4000;
export const SCREEN_ROWS = 256;
export const SCREEN_COLS = 32; // These are 16-bit columns
export const SCREEN_SIZE = SCREEN_ROWS * SCREEN_COLS;
export const KEYBOARD_OFFSET = 0x6000;
export class Memory {
    memory;
    get size() {
        return this.memory.length;
    }
    constructor(memory) {
        if (typeof memory === "number") {
            this.memory = new Int16Array(memory);
        }
        else {
            this.memory = new Int16Array(memory);
        }
    }
    get(index) {
        if (index < 0 || index >= this.size) {
            return 0xffff;
        }
        return this.memory[index] ?? 0;
    }
    set(index, value) {
        if (index >= 0 && index < this.size) {
            this.memory[index] = value & 0xffff;
        }
    }
    reset() {
        this.memory.fill(0);
    }
    update(cell, value, format) {
        let current;
        switch (format) {
            case "asm":
                try {
                    current = op(value);
                }
                catch {
                    current = undefined;
                }
                break;
            case "bin":
                current = int2(value);
                break;
            case "hex":
                current = int16(value);
                break;
            case "dec":
            default:
                current = int10(value);
                break;
        }
        if (current !== undefined && isFinite(current) && current <= 0xffff) {
            this.set(cell, current);
        }
    }
    async load(fs, path, offset) {
        try {
            this.loadBytes(await load(fs, path), offset);
        }
        catch (_cause) {
            // throw new Error(`ROM32K Failed to load file ${path}`, { cause });
            throw new Error(`Memory Failed to load file ${path}`);
        }
    }
    loadBytes(bytes, offset) {
        this.memory.set(new Int16Array(bytes), offset);
        this.memory.fill(0, bytes.length, this.size);
    }
    range(start = 0, end = this.size) {
        return [...this.memory.slice(start, end)];
    }
    *map(fn, start = 0, end = this.size) {
        assert(start <= end);
        for (let i = start; i < end; i++) {
            yield fn(i, this.get(i));
        }
    }
    [Symbol.iterator]() {
        return this.map((_, v) => v);
    }
    isEmpty() {
        return this.memory.every((word) => word === 0);
    }
}
export class SubMemory {
    parent;
    size;
    offset;
    constructor(parent, size, offset) {
        this.parent = parent;
        this.size = size;
        this.offset = offset;
    }
    get(index) {
        if (index < 0 || index >= this.size) {
            return 0xffff;
        }
        return this.parent.get(this.offset + index);
    }
    set(index, value, trackChange = true) {
        if (index >= 0 && index < this.size) {
            this.parent.set(index + this.offset, value);
        }
    }
    reset() {
        for (let i = 0; i < this.size; i++) {
            this.set(i, 0, false);
        }
    }
    update(index, value, format) {
        if (index >= 0 && index < this.size) {
            this.parent.update(index + this.offset, value, format);
        }
    }
    load(fs, path) {
        return this.parent.load(fs, path, this.offset);
    }
    loadBytes(bytes) {
        return this.parent.loadBytes(bytes, this.offset);
    }
    range(start, end) {
        return this.parent.range(start, end);
    }
    map(fn, start = 0, end = this.size) {
        return this.parent.map(fn, start + this.offset, end + this.offset);
    }
    [Symbol.iterator]() {
        return this.map((_, v) => v);
    }
}
export class MemoryKeyboard extends SubMemory {
    constructor(memory) {
        super(memory, 1, 0x6000);
    }
    getKey() {
        return this.get(0);
    }
    setKey(key) {
        this.set(0, key & 0xffff);
    }
    clearKey() {
        this.set(0, 0);
    }
}
export class ROM extends Memory {
    static SIZE = 0x8000;
    constructor(program) {
        if (program) {
            const arr = new Int16Array(ROM.SIZE);
            arr.set(program);
            super(arr.buffer);
        }
        else {
            super(ROM.SIZE);
        }
    }
}
export class RAM extends Memory {
    keyboard = new SubMemory(this, 1, KEYBOARD_OFFSET);
    screen = new SubMemory(this, SCREEN_SIZE, SCREEN_OFFSET);
    // 4k main memory, 2k screen memory, 1 keyboard
    static SIZE = 0x4000 + 0x2000 + 0x0001;
    constructor() {
        super(RAM.SIZE);
    }
}
//# sourceMappingURL=memory.js.map