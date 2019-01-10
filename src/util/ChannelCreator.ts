import {Guild, Permissions, TextChannel} from "discord.js";
import {serverId} from "../config.json";

export class ChannelCreator {
    static create(guild: Guild, name: string): Promise<TextChannel> {
        return guild.createChannel(name, 'text', [
            {
                deny: Permissions.FLAGS.SEND_MESSAGES,
                id: serverId
            }
        ])
            .then(channel => {
                console.log(`${name} channel created successfully`);
                return channel as TextChannel;
            });
    }
}