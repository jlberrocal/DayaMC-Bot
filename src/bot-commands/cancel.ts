import {Command, GuildOnly, ICommand, RequireRole, RequireRunningMatch} from "../decorators";
import {Message} from "discord.js";
import {role} from '../config.json';
import {clearMatch} from "../util";

export class Cancel implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @RequireRunningMatch()
    handle(message: Message): void {
        clearMatch()
            .then(() => message.reply('Se ha cancelado la partida'));
    }
}