import * as fs from "fs";

export function getAllSpecFiles (path: string): string[] {
    const stat = fs.lstatSync(path);
    if (stat.isFile() && path.includes(".spec.json")) {
        return [path];
    }
    if (stat.isDirectory()) {
        return fs.readdirSync(path).flatMap(child => getAllSpecFiles(`${path}\\${child}`));
    }
    return [];
};

