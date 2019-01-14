import {Message} from "discord.js";
import {prefix} from '../config.json';

export interface ICommand {
    handle(message: Message): void;
}

export function Command() {
    return function commandHandler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            if (message.content.startsWith(prefix)) {
                original.call(context, ...arguments);
            }
        }
    }
}