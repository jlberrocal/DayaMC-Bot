import {Message} from "discord.js";
import {Resolver} from "../util/resolver";
import {MessagesHandler} from "../util/messages-handler";

export default function (message: Message) {
    const handler = Resolver.get('messageHandler') as MessagesHandler;
    handler.handle(message);
};