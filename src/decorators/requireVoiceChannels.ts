import {BotChannel} from "../models/bot-channel";
import {Message} from "discord.js";
import {prefix} from '../config.json';

export function RequireVoiceChannel() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function () {
            console.log('validating if exists a voice channel');
            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Voice'
                }
            }).then((channel: BotChannel | null) => {
                if(!channel) {
                    console.log('voice channel does not exists');
                    message.reply(`Debes primero establecer el chat de voz donde se hará el conteo, usa para ello el comando \`${prefix}speak\``)
                } else if(!message.guild.channels.find(c => c.id === channel.channelId)) {
                    console.log('voice channel was deleted');
                    message.reply('El chat de voz fue eliminado')
                } else {
                    console.log('voice channel exists, calling next validator');
                    original.call(context, ...arguments);
                }
            });
        }
    }
}