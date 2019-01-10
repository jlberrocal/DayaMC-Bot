import {Client, GuildChannel, PartialTextBasedChannelFields, TextChannel} from "discord.js";
import {PermissionsHandler} from "./PermissionsHandler";
import {ChannelCreator} from "./ChannelCreator";
import {serverId} from "../config.json";

export class AfterLogin {
    constructor(private client: Client) {
        console.log('client connected successfully');
        console.log(`logged in as ${client.user.username} - (${client.user.id})`);
    }

    handle(): Promise<TextChannel[]> {
        const guild = this.client.guilds.array().find(guild => guild.id === serverId);
        if (!guild) {
            throw new Error("This should not happen, bot is not part of any guild");
        }

        const countChannel = guild.channels.array().find(channel => channel.name === 'conteo');
        const codesChannel = guild.channels.array().find(channel => channel.name === 'codigo');

        const promises = [];

        if (countChannel) {
            const handler = new PermissionsHandler(countChannel);
            promises.push(handler.revoke());
        } else {
            promises.push(ChannelCreator.create(guild, 'conteo'));
        }

        if(codesChannel) {
            const handler = new PermissionsHandler(codesChannel);
            promises.push(handler.revoke());
        } else {
            promises.push(ChannelCreator.create(guild, 'codigo'));
        }

        return Promise.all(promises);
    }
}