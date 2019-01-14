import {Command, ICommand} from "../decorators/command";
import {Message, VoiceConnection} from "discord.js";
import {BotChannel} from "../models/bot-channel";
import {RequireVoiceConnection} from "../decorators/requireVoiceConnection";
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRole} from "../decorators/requireRole";
import {role} from '../config.json';
import {RequireTextChannel} from "../decorators/requireTextChannel";

export class Speak implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @RequireTextChannel()
    @RequireVoiceConnection()
    handle(message: Message): void {
        const voiceChannel = message.member.voiceChannel;

        voiceChannel.join().then((con: VoiceConnection) => {
            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Voice'
                }
            }).then((saved: BotChannel | null) => {
                const botChannel = saved || new BotChannel({
                    guild: message.guild.id,
                    type: 'Voice',
                });

                botChannel.channelId = con.channel.id;
                botChannel.save()
                    .then(() => message.reply(`Se ha establecido \`${con.channel.name}\` como el canal de voz`))
                    .then(() => voiceChannel.leave());
            });
        });
    }
}