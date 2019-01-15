import {BotChannel} from "../models/bot-channel";
import {Message} from "discord.js";
import {prefix} from '../config.json';

export function RequireCodesChannel() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function () {
            console.log('validating if exists a channel for codes');

            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Codes'
                }
            }).then((channel: BotChannel | null) => {
                if(!channel) {
                    console.log('codes channel does not exists');
                    message.reply(`Debes primero establecer el chat donde los jugadores enviarán el código, usa para ello el comando \`${prefix}codes\``)
                } else if(!message.guild.channels.find(c => c.id === channel.channelId)) {
                    console.log('codes channel does not exists on guild');
                    message.reply('El chat de códigos fue eliminado')
                } else if (message.channel.id === channel.channelId) {
                    console.log('codes channel exists, calling next validator');
                    original.call(context, ...arguments);
                }
            });
        }
    }
}