import * as loader from "./loader.js";
export async function load(fs, path) {
    if (path.endsWith(".hack")) {
        return loadHack(fs, path);
    }
    if (path.endsWith(".asm")) {
        return loadAsm(fs, path);
    }
    throw new Error(`Cannot load file without hack or asm extension ${path}`);
}
export async function loadAsm(fs, path) {
    return loader.loadAsm(await fs.readFile(path));
}
export async function loadHack(fs, path) {
    return loader.loadHack(await fs.readFile(path));
}
//# sourceMappingURL=fs.js.map