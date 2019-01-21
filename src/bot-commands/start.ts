import {Command, GuildOnly, ICommand, RequireCommandsChannel, RequireRole, RequireVoiceChannel} from "../decorators";
import {Message, VoiceChannel} from "discord.js";
import {role} from "../config.json";
import {join} from "path";
import {ForkedRef, Resolver} from "../util";
import {NoRunningMatch} from "../decorators/no-running-match";
import {getChannels} from "../util/get-channels";
import {fork} from "child_process";

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
    async handle(message: Message): Promise<void> {
        const [voice] = await getChannels(message.guild, 'Voice', 'Codes') as [VoiceChannel];
        const voiceConnection = await voice.join();
        const dispatcher = voiceConnection.playFile(this.countdownPath, {
            bitrate: 96
        });

        dispatcher.once('end', () => this.streamEnd(voice, message));
    }

    private async streamEnd(voice: VoiceChannel, message: Message) {
        console.log('stream end');
        voice.leave();

        const forked = fork(join(__dirname, '..', 'child_processes', 'codes'), [message.guild.id]);
        ForkedRef.next(forked);
    }
}