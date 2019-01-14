import {join} from "path";
import {promisify} from "util";
import {readdir as readCb} from "fs";
const readdir = promisify(readCb);

export function loadDbHooks(hooksPath: string) {
    readdir(hooksPath)
        .then((files: string[]) => {
            files
                .map(file => file.replace('.ts', '').replace('.js', ''))
                .forEach(file => {
                    const modulePath = join(hooksPath, file);
                    const module = require(modulePath).default;
                    module();
                })
        })
        .catch(err => {
            throw err;
        });
}