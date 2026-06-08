import { FileSystem } from "@davidsouther/jiffies/lib/esm/fs.js";
export declare function load(fs: FileSystem, path: string): Promise<number[]>;
export declare function loadAsm(fs: FileSystem, path: string): Promise<number[]>;
export declare function loadHack(fs: FileSystem, path: string): Promise<number[]>;
