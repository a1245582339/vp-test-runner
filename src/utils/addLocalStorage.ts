import * as fs from 'fs';
import { getAllSpecFiles } from './getAllSpecFiles';

export const addLocalStorage = (path: string, key: string, value: string) => {
    const files = getAllSpecFiles(path);
    files.forEach((filePath) => {
        const spec = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        spec.context.localStorage = spec.context.localStorage || [{}];
        spec.context.localStorage[0][key] = value;
        fs.writeFileSync(filePath, JSON.stringify(spec, null, 4))
    });
}