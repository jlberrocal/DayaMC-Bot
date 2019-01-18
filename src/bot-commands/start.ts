import {Command, GuildOnly, ICommand, RequireCommandsChannel, RequireRole, RequireVoiceChannel} from "../decorators";
import {Message, TextChannel, VoiceChannel} from "discord.js";
import {role, timeout} from "../config.json";
import {join} from "path";
import {CancelSignal, clearMatch, MessageRef, Resolver, TimeoutSubscription} from "../util";
import {NoRunningMatch} from "../decorators/no-running-match";
import {getChannels} from "../util/get-channels";
import {timer} from "rxjs";
import {takeUntil} from "rxjs/operators";

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
        const [voice, codes] = await getChannels(message.guild, 'Voice', 'Codes') as [VoiceChannel, TextChannel];
        const voiceConnection = await voice.join();
        const dispatcher = voiceConnection.playFile(this.countdownPath, {
            bitrate: 96
        });

        dispatcher.once('end', () => this.streamEnd(voice, codes, message));
    }

    private async streamEnd(voice: VoiceChannel, codes: TextChannel, message: Message) {
        console.log('stream end');
        voice.leave();

        await codes.overwritePermissions(message.guild.id, {
            SEND_MESSAGES: true
        });

        codes.send('Esperando a los jugadores')
            .then((msg: Message | Message[]) => {
                MessageRef.next(msg as Message);
                const subs = timer(timeout)
                    .pipe(
                        takeUntil(CancelSignal)
                    )
                    .subscribe(() => clearMatch());
                TimeoutSubscription.next(subs);
                Resolver.register('message', msg);
                const timeoutRef = setTimeout(clearMatch, timeout);

                Resolver.register('timeout', timeoutRef);
            });
    }
}