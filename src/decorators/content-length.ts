import {Message} from "discord.js";

export function ContentLength(length: number) {
    return function commandHandler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating content length of message');
            const context = this;
            const message: Message = arguments[0];

            if (message.content.length === length) {
                console.log('content length is ok, calling next validator');
                original.call(context, ...arguments);
            } else {
                console.log(`content length is not ${length} deleting message`);
                message.delete();
            }
        }
    }
}