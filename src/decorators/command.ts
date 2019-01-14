import {Message} from "discord.js";
import {prefix} from '../config.json';

export interface ICommand {
    handle(message: Message): void;
}

export function Command() {
    return function commandHandler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating command');
            const context = this;
            const message: Message = arguments[0];

            if (message.content.startsWith(prefix)) {
                console.log('is a command, calling next validation');
                original.call(context, ...arguments);
            }
        }
    }
}