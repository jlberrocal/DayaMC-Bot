import {Message, TextChannel} from "discord.js";

export class CodesHandler {
    private static readonly match: Map<string, string[]> = new Map();
    private static messageRef: Message | null = null;

    constructor(private channel: TextChannel) {
    }

    handle(msg: Message, content: string, userId: string, botId: string) {
        if (userId !== botId) {
            msg.delete()
                .then(() => console.log('message received no needed anymore'));
        }

        const keysArray = [...CodesHandler.match.keys()];

        for (let key of keysArray) {
            const users = CodesHandler.match.get(key) || [];
            const index = users.indexOf(`<@${userId}>`);
            if (index > -1) {
                users.splice(index, 1);
                break;
            }
        }


        if (content.length !== 3) {
            return;
        }

        const users = CodesHandler.match.get(content) || [];
        users.push(`<@${userId}>`);
        CodesHandler.match.set(content, users);

        [...CodesHandler.match.keys()]
            .forEach(key => {
                const values = CodesHandler.match.get(key);
                if (!values || values.length === 0) {
                    CodesHandler.match.delete(key);
                }
            });

        const message = [...CodesHandler.match.keys()]
            .map(key => {
                const values = CodesHandler.match.get(key) || [];
                return `${key} - (${values.length} players)\n ${values.join(', ')}`
            })
            .join('\n\n');

        CodesHandler.messageRef!.edit(message);
    }

    private static start(channel: TextChannel) {
        channel.send("Esperando jugadores...")
            .then(msgRef => this.messageRef = msgRef as Message);
    }

    static reset(channel: TextChannel) {
        if (this.messageRef) {
            this.messageRef.delete(0);
        }

        if (this.match) {
            this.match.clear();
        }

        this.start(channel);
    }
}