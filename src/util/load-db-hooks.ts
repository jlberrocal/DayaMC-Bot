import {join} from "path";
import {promisify} from "util";
import {readdir as readCb} from "fs";

const readdir = promisify(readCb);

export function loadDbHooks(hooksPath: string) {
    readdir(hooksPath)
        .then((files: string[]) => {
            files
                .filter(file => !file.endsWith('.d.ts'))
                .filter(fileName => !fileName.startsWith('index'))
                .map(file => file.replace('.ts', '').replace('.js', ''))
                .forEach(file => {
                    const modulePath = join(hooksPath, file);
                    const module = require(modulePath);
                    const moduleDefault = module.default;
                    moduleDefault();
                })
        })
        .catch(err => {
            throw err;
        });
}