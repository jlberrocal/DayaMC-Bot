import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";
import {RequireRole} from "../decorators/requireRole";
import {role} from "../config.json";
import {GuildOnly} from "../decorators/guildOnly";

export class Ping implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        message.reply('pong');
    }
}