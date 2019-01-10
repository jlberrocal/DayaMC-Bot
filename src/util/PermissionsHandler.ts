import {GuildChannel, TextChannel} from "discord.js";
import {serverId} from "../config.json";

export class PermissionsHandler {
    constructor(private channel: GuildChannel) {

    }

    private change(state: boolean): Promise<void> {
        return this.channel.overwritePermissions(serverId, {
            SEND_MESSAGES: state
        }, 'not too much to say')
            .catch(console.error.bind(console));;
    }

    grant(): Promise<TextChannel> {
        return this.change(true)
            .then(() => {
                console.info(`write messages permission on channel ${this.channel.name} were granted`);
                return this.channel as TextChannel;
            })
    }

    revoke(): Promise<TextChannel> {
        return this.change(false)
            .then(() => {
                console.info(`write messages permission on channel ${this.channel.name} were revoked`);
                return this.channel as TextChannel;
            })
    }
}