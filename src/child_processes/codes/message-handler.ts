import {ContentLength, OnlyCodesChannel} from "../../decorators";
import {Message} from "discord.js";
import {Match} from "../../models";
import {notify} from "../../util";

export class MessageHandler {
    @OnlyCodesChannel()
    @ContentLength(3)
    handle(message: Message, groupMessage: Message): void {
        const {content, author} = message;
        Match.findOne({
            where: {
                player: author.id
            }
        }).then(savedMatch => {
            const match = savedMatch || new Match({
                player: author.id,
            });

            match.code = content.toLowerCase();
            match.save()
                .then(() => message.delete())
                .then(() => {
                    notify(groupMessage);
                });
        });
    }

}