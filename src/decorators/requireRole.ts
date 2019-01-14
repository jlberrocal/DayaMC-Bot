import {Message} from "discord.js";
import {BotChannel} from "../models/bot-channel";

export function RequireRole(roleName: string) {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            const role = message.guild.roles.find((r => r.name === roleName));

            if (!role) {
                message.reply(`Debes crear el rol \`${roleName}\` y pertenecer a él`);
            } else if (!message.member.roles.has(role.id)) {
                BotChannel.count({
                    where: {
                        guild: message.guild.id,
                        channelId: message.channel.id,
                        type: 'Text'
                    }
                }).then((count: number) => {
                    if (count > 0) {
                        message.delete();
                    }
                });
            } else {
                original.call(context, ...arguments);
            }
        }
    }
}
