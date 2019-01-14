import {Message} from "discord.js";

export function GuildOnly() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original:Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating guild');
            const context = this;
            const message: Message = arguments[0];

            if(!message.guild) {
                console.log('there is no guild');
                message.reply('Lo siento pero esto solo se puede ejecutar en un chat grupal');
            } else {
                console.log('is a guild, calling next validation');
                original.call(context, ...arguments);
            }
        }
    }
}