import {BotChannel} from "../models/bot-channel";
import {Message} from "discord.js";
import {prefix} from '../config.json';

export function RequireTextChannel() {
     return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
         const original = descriptor.value;

         descriptor.value = function () {
             const context = this;
             const message: Message = arguments[0];

             BotChannel.findOne({
                 where: {
                     guild: message.guild.id,
                     type: 'Text'
                 }
             }).then((channel: BotChannel | null) => {
                 if(!channel) {
                     message.reply(`Debes primero establecer el chat donde escucharé los comandos, ejecuta para ello el comando \`${prefix}listen\``)
                 } else if(!message.guild.channels.find(c => c.id === channel.channelId)) {
                     message.reply('El chat donde escucho los comandos fue eliminado')
                 } else if (message.channel.id === channel.channelId) {
                     original.call(context, ...arguments);
                 }
             });
         }
     }
}