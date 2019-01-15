import {TextChannel} from "discord.js";

export class CodesChannel {
    channel: TextChannel;

    constructor(channel: TextChannel) {
        this.channel = channel;
    }

    allowMessages(roleId: string, allow: boolean = true) {
        return this.channel.overwritePermissions(roleId, {
            SEND_MESSAGES: true
        });
    }

}