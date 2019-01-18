import {Guild, Message} from "discord.js";
import {BotChannel} from "../models";

export function ResolveChannel(type: 'Voice' | 'Commands' | 'Codes') {
    return function handler(target: any, name: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = async function (message: Message) {
            const context = this;
            const {guild} = message;
            const channel = await BotChannel.findOne({
                where: {
                    guild: guild.id,
                    type: type
                }
            });

            if (!channel) {
                return;
            }

            const guildChannel = getChannel(type, guild, channel);
            original.call(context, message, guildChannel);
        }
    }
}

function getChannel(type: 'Voice' | 'Commands' | 'Codes', guild: Guild, channel: BotChannel) {
    switch (type) {
        case 'Voice':
            return guild.channels.find(c => c.id === channel.channelId && c.type === 'voice');
        case 'Commands':
        case 'Codes':
            return guild.channels.find(c => c.id === channel.channelId && c.type === "text");
    }
}