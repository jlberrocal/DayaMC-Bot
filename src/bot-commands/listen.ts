import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";
import {BotChannel} from "../models/bot-channel";
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRole} from "../decorators/requireRole";
import {role} from '../config.json';

export class Listen implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        BotChannel.findOne({
            where: {
                guild: message.guild.id,
                type: 'Text'
            }
        }).then((saved: BotChannel | null) => {
            const botChannel = saved || new BotChannel({
                guild: message.guild.id,
                type: 'Text',
            });

            botChannel.channelId = message.channel.id;
            botChannel.save()
                .then(() => message.reply('De ahora en adelante solo escucharé comandos en este canal'));
        });
    }
}