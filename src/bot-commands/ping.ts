import {Command, GuildOnly, ICommand, RequireRole} from "../decorators";
import {Message} from "discord.js";
import {role} from "../config.json";

export class Ping implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        message.reply('pong');
    }
}