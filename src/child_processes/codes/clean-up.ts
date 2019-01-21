import {Match} from "../../models";
import {Client, Message, TextChannel} from "discord.js";

export function cleanUp(codesChannel: TextChannel, guild: string, messageRef: Message, client: Client) {
    console.log('cleaning up');
    Promise.all([
        codesChannel.overwritePermissions(guild, {
            SEND_MESSAGES: false
        }),
        messageRef.delete(),
        client.destroy(),
        Match.truncate()
    ]).then(() => process.exit(0));
}