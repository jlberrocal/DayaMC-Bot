import {Message} from "discord.js";
import {Resolver} from "./resolver";
import {Match} from "../models";

export function clearMatch() {
    const msgRef: Message | number = Resolver.get('message');
    const timeout: any = Resolver.get('timeout');

    if (msgRef !== 0) {
        Match.truncate()
            .then(() => (msgRef as Message).delete())
            .then(() => Resolver.register('message', 0));
    }

    if (timeout !== 0) {
        clearTimeout(timeout);
        Resolver.register('timeout', 0);
    }
}