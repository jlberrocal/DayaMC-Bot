import {Guild, GuildChannel} from "discord.js";
import {BotChannel} from "../models";
import {or} from "sequelize";

export async function getChannels(guild: Guild, ...channelTypes: ('Voice' | 'Commands' | 'Codes')[]): Promise<Array<GuildChannel>> {
    const channels = await BotChannel.findAll({
        where: {
            guild: guild.id,
            type: or(...channelTypes)
        }
    });

    if (!channels) {
        return [];
    }


    return channelTypes.map(type => channels.find(c => c.type === type) as BotChannel)
        .map((channel: BotChannel) => guild.channels.find(c => c.id === channel.channelId));
}