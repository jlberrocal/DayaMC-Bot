import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRunningMatch} from "../decorators/requireRunningMatch";
import {role} from '../config.json';
import {RequireRole} from "../decorators/requireRole";
import {clearMatch} from "../util/clear-match";

export class Cancel implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @RequireRunningMatch()
    handle(message: Message): void {
        clearMatch();
    }
}