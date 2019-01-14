import {Message} from "discord.js";

export interface ICommand {
    handle(message: Message): void;
}

export function ContentLength() {
    return function commandHandler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            if (message.content.length === 3) {
                original.call(context, ...arguments);
            } else {
                message.delete();
            }
        }
    }
}