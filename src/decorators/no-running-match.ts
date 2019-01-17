import {Message} from "discord.js";
import {Resolver} from "../util";
import {prefix} from '../config.json';

export function NoRunningMatch() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating if there is no running match');
            const context = this;
            const message: Message = arguments[0];

            const timeout = Resolver.get('timeout');

            if (timeout !== 0) {
                console.log('there is a running match at this time');
                message.reply(`Hay una partida en este momento, debes cancelarla primero con \`${prefix}cancel\``)
            } else {
                console.log('there is a no a running match, calling next validator');
                original.call(context, ...arguments);
            }
        }
    }
}