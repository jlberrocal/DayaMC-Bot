import {BotChannel} from "../models/bot-channel";
import {Message} from "discord.js";
import {prefix} from '../config.json';

export function RequireVoiceChannel() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Voice'
                }
            }).then((channel: BotChannel | null) => {
                if(!channel) {
                    message.reply(`Debes primero establecer el chat de voz donde se hará el conteo, usa para ello el comando \`${prefix}speak\``)
                } else if(!message.guild.channels.find(c => c.id === channel.channelId)) {
                    message.reply('El chat de voz fue eliminado')
                } else {
                    original.call(context, ...arguments);
                }
            });
        }
    }
}