import {Message} from "discord.js";
import {Resolver} from "../util/resolver";

export function RequireRunningMatch() {
    return function handler(target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const original: Function = descriptor.value;

        descriptor.value = function () {
            console.log('validating if there is any running match');
            const context = this;
            const message: Message = arguments[0];

            const timeout = Resolver.get('timeout');

            if (timeout === 0) {
                console.log('there is no running match at this moment');
                message.delete();
            } else {
                console.log('there is a running match, calling next validator');
                original.call(context, ...arguments);
            }
        }
    }
}