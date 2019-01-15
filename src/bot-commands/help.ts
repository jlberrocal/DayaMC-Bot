import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";
import {prefix, role} from '../config.json';
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRole} from "../decorators/requireRole";

export class Help implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        const response = [
            `*${prefix}configure* para configurar los canales necesarios`,
            `*${prefix}ping* para revisar que el bot esté respondiendo`,
            `*${prefix}help* para desplegar este mensaje`,
            `*${prefix}start* para iniciar un nuevo conteo`,
            `*${prefix}cancel* para cancelar el conteo en ejecución`,
        ].join('\n');

        message.channel.send(response);
    }
}