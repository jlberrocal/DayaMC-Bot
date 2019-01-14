import {Message} from "discord.js";

export function RequireVoiceConnection() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original:Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) {
                message.reply('Unete a un canal de audio y envía nuevamente el comando');
            } else {
                original.call(context, ...arguments);
            }
        }
    }
}