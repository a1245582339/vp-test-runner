import * as fs from 'fs';
import { getAllSpecFiles } from './getAllSpecFiles';

export const addFlight = (path: string, flightId: string) => {
    const files = getAllSpecFiles(path);
    files.forEach((filePath) => {
        const spec = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        spec.context.flightId = spec.context.flightId || [""];
        spec.context.flightId[0] = Array.from((new Set(spec.context.flightId[0].split(","))).add(flightId)).filter(flight => !!flight).join(",");
        fs.writeFileSync(filePath, JSON.stringify(spec, null, 4))
    });
}