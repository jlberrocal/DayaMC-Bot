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

const readdir = promisify(readdirCb);

export class MessagesHandler {
    private handlers: Map<string, ICommand> = new Map();
    private client: Client;

    constructor(handlersPath: string) {
        this.client = Resolver.get('bot');

        readdir(handlersPath)
            .then(fileNames => fileNames.map(name => name.replace('.ts', '').replace('.js', '')))
            .then((commandNames: string[]) => {
                commandNames.forEach(commandName => {
                    const module = require(join(handlersPath, commandName));
                    if (Object.keys(module).length > 1) {
                        throw new Error('commands classes should only export 1 class');
                    }

                    const name = Object.keys(module).find(key => key.toLowerCase() === commandName);
                    if (name) {
                        const klass = module[name];
                        this.handlers.set(commandName, new klass());
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

        const command = content.replace(prefix, '');
        const commandHandler = this.handlers.get(command);
        if (commandHandler) {
            commandHandler.handle(message);
        } else {
            this.handleCodesMessages(message);
        }
    }

    @RequireCodesChannel()
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