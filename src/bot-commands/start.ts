import {Command, ICommand} from "../decorators/command";
import {Message, TextChannel, VoiceChannel} from "discord.js";
import {GuildOnly} from "../decorators/guildOnly";
import {RequireRole} from "../decorators/requireRole";
import {role, timeout} from "../config.json";
import {RequireTextChannel} from "../decorators/requireTextChannel";
import {BotChannel} from "../models/bot-channel";
import {join} from "path";
import {Resolver} from "../util/resolver";
import {RequireVoiceChannel} from "../decorators/requireVoiceChannels";
import {clearMatch} from "../util/clearCodesMsg";

export class Start implements ICommand {
    private readonly countdownPath: string;

    constructor() {
        const sourcesPath = Resolver.get('sources-path');
        this.countdownPath = join(sourcesPath, 'countdown-esp.mp3');
    }

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @RequireTextChannel()
    @RequireVoiceChannel()
    handle(message: Message): void {
        BotChannel
            .findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Voice'
                }
            })
            .then(channel =>
                message.guild.channels.array().find(c => c.id === channel!.channelId && c.type === 'voice') as VoiceChannel
            )
            .then((channel: VoiceChannel | undefined) => {
                return channel!
                    .join()
                    .then(con => {
                        return new Promise(resolve => {
                            console.log(this.countdownPath);
                            const dispatcher = con.playFile(this.countdownPath, {
                                bitrate: 96
                            });

                            dispatcher.on('end', () => {
                                console.log('stream end');
                                channel!.leave();
                                resolve();
                            });
                        });
                    })

                    .then(() => {
                        return BotChannel.findOne({
                            where: {
                                type: 'Codes',
                                guild: message.guild.id
                            }
                        });
                    })
                    .then(channel => {
                        return message.guild.channels.find(c => c.id === channel!.channelId) as TextChannel;
                    })
                    .then((channel: TextChannel | null) => {
                        if (!channel) {
                            return;
                        }

                        return channel.overwritePermissions(message.guild.id, {
                            SEND_MESSAGES: true
                        })
                            .then(() => {
                                channel.send('Esperando a los jugadores')
                                    .then((msg: Message | Message[]) => {
                                        Resolver.register('message', msg);
                                        const timeoutRef = setTimeout(clearMatch, timeout);

                                        Resolver.register('timeout', timeoutRef);
                                    });
                            });
                    });
            });
    }
}