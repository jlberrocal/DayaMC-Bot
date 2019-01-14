import {readdir as readdirCb} from "fs";
import {promisify} from "util";
import {join} from "path";
import {Client, Message} from "discord.js";
import {prefix} from '../config.json';
import {ICommand} from "../decorators/command";
import {Resolver} from "./resolver";
import {all} from 'bluebird';
import {RequireCodesChannel} from "../decorators/requireCodesChannel";
import {ContentLength} from "../decorators/content-length";
import {Match} from "../models/match";
import {RequireRunningMatch} from "../decorators/requireRunningMatch";
import {OnlyCodesChannel} from "../decorators/OnlyCodesChannel";

const readdir = promisify(readdirCb);

export class MessagesHandler {
    private handlers: Map<string, ICommand> = new Map();
    private client: Client;

    constructor(handlersPath: string) {
        this.client = Resolver.get('bot');

        readdir(handlersPath)
            .then(fileNames => fileNames.filter(name => !name.endsWith('.d.ts')).map(name => name.replace('.ts', '').replace('.js', '')))
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
            const command = content.replace(prefix, '').toLowerCase().trim();
            const commandHandler = this.handlers.get(command);
            console.log(commandHandler);
            commandHandler!.handle(message);
        } else {
            console.log('handling as code message');
            this.handleCodesMessages(message);
        }
    }

    @OnlyCodesChannel()
    @RequireRunningMatch()
    @ContentLength()
    private handleCodesMessages(message: Message) {
        const {content, author} = message;
        Match.findOne({
            where: {
                player: author.id
            }
        }).then(savedMatch => {
            const match = savedMatch || new Match({
                player: author.id,
            });

            match.code = message.content.toLowerCase();
            match.save().then(() => message.delete());
        });
    }
}