import {Message} from "discord.js";
import {BotChannel} from "../models/bot-channel";

export function RequireRole(roleName: string) {
    return function handler(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('calling role validation');
            const context = this;
            const message: Message = arguments[0];

            const role = message.guild.roles.find((r => r.name === roleName));

            if (!role) {
                console.log('role is not created');
                message.reply(`Debes crear el rol \`${roleName}\` y pertenecer a él`);
            } else if (!message.member.roles.has(role.id)) {
                console.log('user does not have the required role');
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
                console.log('has the role, calling next validation');
                original.call(context, ...arguments);
            }
        }
    }
}
