import {Command, GuildOnly, ICommand, RequireCommandsChannel, RequireRole, RequireVoiceChannel} from "../decorators";
import {Message, TextChannel, VoiceChannel} from "discord.js";
import {role, timeout} from "../config.json";
import {BotChannel} from "../models";
import {join} from "path";
import {clearMatch, Resolver} from "../util";
import {NoRunningMatch} from "../decorators/no-running-match";

export class Start implements ICommand {
    private readonly countdownPath: string;

    constructor() {
        const sourcesPath = Resolver.get('sources-path');
        this.countdownPath = join(sourcesPath, 'countdown-esp.mp3');
    }

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @NoRunningMatch()
    @RequireCommandsChannel()
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