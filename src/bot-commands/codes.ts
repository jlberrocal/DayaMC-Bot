import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRole} from "../decorators/requireRole";
import {role} from '../config.json';
import {BotChannel} from "../models/bot-channel";

export class Codes implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        BotChannel.findOne({
            where: {
                guild: message.guild.id,
                type: 'Codes'
            }
        }).then((saved: BotChannel | null) => {
            const botChannel = saved || new BotChannel({
                guild: message.guild.id,
                type: 'Codes',
            });

            botChannel.channelId = message.channel.id;
            botChannel.save()
                .then(() => message.reply('En este chat los jugadores enviarán el código del server'))
                .then((msg: Message|Message[]) => (msg as Message).pin());
        });
    }
}