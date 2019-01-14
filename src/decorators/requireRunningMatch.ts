import {Message} from "discord.js";
import {Resolver} from "../util/resolver";

export function RequireRunningMatch() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            const context = this;
            const message: Message = arguments[0];

            const timeout = Resolver.get('timeout');

            if (timeout === 0) {
                message.delete();
            } else {
                original.call(context, ...arguments);
            }
        }
    }
}