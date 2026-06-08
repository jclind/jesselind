import { ERRNO } from "./errors.js";
export class SysLib {
    os;
    _blocked = false;
    _released = false;
    _returnValue = 0;
    _halted = false;
    _exitCode = 0;
    cancelWait = false;
    animationFrameId;
    constructor(os) {
        this.os = os;
    }
    get blocked() {
        return this._blocked;
    }
    get released() {
        return this._released;
    }
    get halted() {
        return this._halted;
    }
    get exitCode() {
        return this._exitCode;
    }
    block() {
        this._blocked = true;
    }
    release(returnValue) {
        this._blocked = false;
        this._returnValue = returnValue ?? 0;
        this._released = true;
    }
    readReturnValue() {
        this._released = false;
        return this._returnValue;
    }
    wait(ms) {
        if (ms <= 0) {
            this.error(ERRNO.SYS_WAIT_DURATION_NOT_POSITIVE);
            return;
        }
        this.block();
        (async () => {
            await new Promise((x) => setTimeout(x, ms));
            this.release();
        })();
    }
    halt() {
        this._halted = true;
        this._exitCode = 0;
    }
    error(code) {
        this.os.output.printJsString(`ERR${code}`);
        this._halted = true;
        this._exitCode = code;
    }
    dispose() {
        this.cancelWait = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}
//# sourceMappingURL=sys.js.map