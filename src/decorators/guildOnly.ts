import {Message} from "discord.js";

export function GuildOnly() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original:Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            if(!message.guild) {
                message.reply('Lo siento pero esto solo se puede ejecutar en un chat grupal');
            } else {
                original.call(context, ...arguments);
            }
        }
    }
}