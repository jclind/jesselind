import { KeyboardLib } from "./keyboard.js";
import { MemoryLib } from "./memory.js";
import { OutputLib } from "./output.js";
import { ScreenLib } from "./screen.js";
import { StringLib } from "./string.js";
import { SysLib } from "./sys.js";
export class OS {
    vmMemory;
    screen;
    memory;
    string;
    output;
    keyboard;
    sys;
    paused = false;
    constructor(memory) {
        this.vmMemory = memory;
        this.screen = new ScreenLib(this.vmMemory, this);
        this.memory = new MemoryLib(this.vmMemory, this);
        this.string = new StringLib(this.vmMemory, this);
        this.output = new OutputLib(this);
        this.keyboard = new KeyboardLib(this.vmMemory, this);
        this.sys = new SysLib(this);
    }
    dispose() {
        this.keyboard.dispose();
        this.sys.dispose();
    }
}
//# sourceMappingURL=os.js.map