import { VmMemory } from "../memory.js";
import { KeyboardLib } from "./keyboard.js";
import { MemoryLib } from "./memory.js";
import { OutputLib } from "./output.js";
import { ScreenLib } from "./screen.js";
import { StringLib } from "./string.js";
import { SysLib } from "./sys.js";
export declare class OS {
    private vmMemory;
    screen: ScreenLib;
    memory: MemoryLib;
    string: StringLib;
    output: OutputLib;
    keyboard: KeyboardLib;
    sys: SysLib;
    paused: boolean;
    constructor(memory: VmMemory);
    dispose(): void;
}
