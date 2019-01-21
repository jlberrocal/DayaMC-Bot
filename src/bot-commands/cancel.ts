import {Command, GuildOnly, ICommand, RequireRole, RequireRunningMatch} from "../decorators";
import {Message} from "discord.js";
import {role} from '../config.json';
import {clearMatch, ForkedRef} from "../util";

export class Cancel implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @RequireRunningMatch()
    handle(message: Message): void {
        clearMatch();
        const ref = ForkedRef.value;
        if(ref) {
            ref.send('cancel');
            message.reply('Se ha cancelado la partida');
        }
    }
}