import {Message} from "discord.js";
import {Resolver} from "./resolver";
import {Match} from "../models";

export function clearMatch() {
    const msgRef: Message | number = Resolver.get('message');
    const timeout: any = Resolver.get('timeout');

    if (msgRef !== 0) {
        Match.truncate()
            .then(() => {
                if(msgRef instanceof Message) {
                    const {guild, channel} = msgRef;
                    msgRef.delete().then(() => {
                        const guildChannel = guild.channels.find(c => c.id === channel.id);
                        return guildChannel.overwritePermissions(guild.id, {
                            SEND_MESSAGES: true
                        });
                    });
                }
            })
            .then(() => Resolver.register('message', 0));
    }

    if (timeout !== 0) {
        clearTimeout(timeout);
        Resolver.register('timeout', 0);
    }
}