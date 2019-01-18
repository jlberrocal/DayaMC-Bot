import {CancelSignal, MessageRef, TimeoutSubscription} from "./resolver";
import {Match} from "../models";

export function clearMatch() {
    console.log('clearing match');
    const messageRef = MessageRef.value;
    const timeoutRef = TimeoutSubscription.value;

    if (messageRef) {
        const {guild, channel} = messageRef;
        const guildChannel = guild.channels.find(c => c.id === channel.id);
        const promises = [
            Promise.resolve(Match.truncate()),
            messageRef.delete().then(() => {}),
            guildChannel.overwritePermissions(guild.id, {
                SEND_MESSAGES: true
            })
        ];

        Promise.all(promises)
            .then(() => MessageRef.next(null))
    }

    if (timeoutRef) {
        CancelSignal.next();
        TimeoutSubscription.next(null);
    }
}