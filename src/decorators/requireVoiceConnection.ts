import {Message} from "discord.js";

export function RequireVoiceConnection() {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original:Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating if user is joined to a voice channel');
            const context = this;
            const message: Message = arguments[0];

            const voiceChannel = message.member.voiceChannel;
            if (!voiceChannel) {
                console.log('user is not on any voice channel');
                message.reply('Unete a un canal de audio y envía nuevamente el comando');
            } else {
                console.log('user is on voice channel, calling next validator');
                original.call(context, ...arguments);
            }
        }
    }
}