import {readdir as readCb} from 'fs';
import {join} from "path";
import {promisify} from 'util';
import {Resolver} from "./resolver";
import {Client} from "discord.js";

const readdir = promisify(readCb);

export function loadBotHooks(hooksPath: string) {
    const client = Resolver.get('bot') as Client;

    readdir(hooksPath)
        .then((files: string[]) => {
            files
                .filter(file => !file.endsWith('.d.ts'))
                .filter(fileName => !fileName.startsWith('index'))
                .map(file => file.replace('.ts', '').replace('.js', ''))
                .forEach(file => {
                    const modulePath = join(hooksPath, file);
                    client.on(file, require(modulePath).default);
                })
        })
        .catch(err => {
            throw err;
        });
};
