import {Message} from "discord.js";
import {MessagesHandler, Resolver} from "../util";

export default function (message: Message) {
    const handler = Resolver.get('messageHandler') as MessagesHandler;
    handler.handle(message);
};