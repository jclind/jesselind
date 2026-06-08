import { FileSystem } from "@davidsouther/jiffies/lib/esm/fs.js";
export declare const FORMATS: string[];
export type Format = (typeof FORMATS)[number];
export declare const SCREEN_OFFSET = 16384;
export declare const SCREEN_ROWS = 256;
export declare const SCREEN_COLS = 32;
export declare const SCREEN_SIZE: number;
export declare const KEYBOARD_OFFSET = 24576;
export interface MemoryAdapter {
    size: number;
    get(index: number): number;
    set(index: number, value: number): void;
    reset(): void;
    update(cell: number, value: string, format: Format): void;
    load(fs: FileSystem, path: string, offset?: number): Promise<void>;
    loadBytes(bytes: number[], offset?: number): void;
    range(start?: number, end?: number): number[];
    map<T>(fn: (index: number, value: number) => T, start?: number, end?: number): Iterable<T>;
    [Symbol.iterator](): Iterable<number>;
}
export interface KeyboardAdapter {
    getKey(): number;
    setKey(key: number): void;
    clearKey(): void;
}
export declare class Memory implements MemoryAdapter {
    private memory;
    get size(): number;
    constructor(memory: ArrayBuffer | number);
    get(index: number): number;
    set(index: number, value: number): void;
    reset(): void;
    update(cell: number, value: string, format: Format): void;
    load(fs: FileSystem, path: string, offset?: number): Promise<void>;
    loadBytes(bytes: number[], offset?: number): void;
    range(start?: number, end?: number): number[];
    map<T>(fn: (index: number, value: number) => T, start?: number, end?: number): Iterable<T>;
    [Symbol.iterator](): Iterable<number>;
    isEmpty(): boolean;
}
export declare class SubMemory implements MemoryAdapter {
    private readonly parent;
    readonly size: number;
    private readonly offset;
    constructor(parent: MemoryAdapter, size: number, offset: number);
    get(index: number): number;
    set(index: number, value: number, trackChange?: boolean): void;
    reset(): void;
    update(index: number, value: string, format: string): void;
    load(fs: FileSystem, path: string): Promise<void>;
    loadBytes(bytes: number[]): void;
    range(start?: number, end?: number): number[];
    map<T>(fn: (index: number, value: number) => T, start?: number, end?: number): Iterable<T>;
    [Symbol.iterator](): Iterable<number>;
}
export declare class MemoryKeyboard extends SubMemory implements KeyboardAdapter {
    constructor(memory: MemoryAdapter);
    getKey(): number;
    setKey(key: number): void;
    clearKey(): void;
}
export declare class ROM extends Memory {
    static readonly SIZE = 32768;
    constructor(program?: Int16Array);
}
export declare class RAM extends Memory {
    keyboard: SubMemory;
    screen: SubMemory;
    static readonly SIZE: number;
    constructor();
}
