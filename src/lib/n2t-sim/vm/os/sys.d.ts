import { OS } from "./os.js";
export declare class SysLib {
    private os;
    private _blocked;
    private _released;
    private _returnValue;
    private _halted;
    private _exitCode;
    private cancelWait;
    private animationFrameId;
    constructor(os: OS);
    get blocked(): boolean;
    get released(): boolean;
    get halted(): boolean;
    get exitCode(): number;
    block(): void;
    release(returnValue?: number): void;
    readReturnValue(): number;
    wait(ms: number): void;
    halt(): void;
    error(code: number): void;
    dispose(): void;
}
