import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {Client, Message} from "discord.js";

export const MessageRef = new BehaviorSubject<Message|null>(null);
export const ClientRef = new BehaviorSubject<Client|null>(null);
export const TimeoutSubscription = new BehaviorSubject<Subscription|null>(null);

export const CancelSignal = new Subject();

export class Resolver {
    private static readonly modules: Map<string, any> = new Map();

    static register<T>(name: string, instance: T): Resolver {
        this.modules.set(name, instance);
        return this;
    }

    static get(name: string): any {
        if(!this.modules.has(name)) {
            throw new Error('no declared instance of ' + name);
        }

        return this.modules.get(name);
    }
}