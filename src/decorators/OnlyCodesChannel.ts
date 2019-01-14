import {Message} from "discord.js";
import {BotChannel} from "../models/bot-channel";

export function OnlyCodesChannel() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Codes'
                }
            }).then((channel: BotChannel | null) => {
                if (!channel || channel.channelId !== message.channel.id) {
                    return;
                }

                original.call(context, ...arguments);
            });
        }
    }
}
