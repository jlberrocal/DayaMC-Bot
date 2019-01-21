import {readdir as readdirCb} from "fs";
import {promisify} from "util";
import {join} from "path";
import {Client, Message} from "discord.js";
import {prefix} from '../config.json';
import {ContentLength, ICommand, OnlyCodesChannel, RequireRunningMatch} from "../decorators";
import {Resolver} from "./resolver";
import {all} from 'bluebird';
import {Match} from "../models";

const readdir = promisify(readdirCb);

export class MessagesHandler {
    private handlers: Map<string, ICommand> = new Map();
    private client: Client;

    constructor(handlersPath: string) {
        this.client = Resolver.get('bot');

        readdir(handlersPath)
            .then(fileNames => {
                return fileNames
                    .filter(name => !name.endsWith('.d.ts'))
                    .filter(name => !name.startsWith('index'))
                    .map(name => name
                        .replace('.ts', '')
                        .replace('.js', '')
                    )
            })
            .then((commandNames: string[]) => {
                commandNames.forEach(commandName => {
                    const module = require(join(handlersPath, commandName));
                    if (Object.keys(module).length > 1) {
                        throw new Error('commands classes should only export 1 class');
                    }

                    const name = Object.keys(module).find(key => key.toLowerCase() === commandName);
                    if (name) {
                        const klass = module[name];
                        this.handlers.set(commandName.toLowerCase().trim(), new klass());
                    }
                });
            })
            .catch((err) => console.error(err))
    }

    handle(message: Message) {
        const {content, author} = message;

        if (this.client.user.equals(author)) {
            return; //bot should do nothing to his own messages
        }

        if (content.startsWith(prefix)) {
            console.log('handling as command');
            const command = content.replace(prefix, '');
            const commandHandler = this.handlers.get(command);
            if (commandHandler) {
                commandHandler.handle(message);
            } else {
                console.log(`${command} is not a valid command`);
            }
        } else {
            console.log('handling as code message');
            //this.handleCodesMessages(message);
        }
    }

    @OnlyCodesChannel()
    @RequireRunningMatch()
    @ContentLength(3)
    private handleCodesMessages(message: Message) {

    }
}