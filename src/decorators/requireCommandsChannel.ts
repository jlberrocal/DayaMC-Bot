import {BotChannel} from "../models";
import {Message} from "discord.js";
import {prefix} from '../config.json';

export function RequireCommandsChannel() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;

        descriptor.value = function () {
            console.log('validating if exists a channel for commands');

            const context = this;
            const message: Message = arguments[0];

            BotChannel.findOne({
                where: {
                    guild: message.guild.id,
                    type: 'Commands'
                }
            }).then((channel: BotChannel | null) => {
                if (!channel) {
                    console.log('commands channel does not exists');
                    message.reply(`Debes primero establecer el chat donde escucharé los comandos, ejecuta para ello el comando \`${prefix}listen\``)
                } else if (!message.guild.channels.find(c => c.id === channel.channelId)) {
                    console.log('commands channel was deleted');
                    message.reply('El chat donde escucho los comandos fue eliminado')
                } else if (message.channel.id === channel.channelId) {
                    console.log('commands channel exists, calling next validator');
                    original.call(context, ...arguments);
                }
            });
        }
    }
}