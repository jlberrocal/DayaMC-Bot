import {Message} from "discord.js";
import {BotChannel} from "../models/bot-channel";

export function OnlyCodesChannel() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating if message comes from codes channel');
            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Codes'
                }
            }).then((channel: BotChannel | null) => {
                if (!channel) {
                    console.log('codes channel does not exists');
                }
                else if (channel.channelId !== message.channel.id) {
                    console.log('ignoring message, it came from another channel');
                    return;
                }

                console.log('message came from codes channel, calling next validator');
                original.call(context, ...arguments);
            });
        }
    }
}
