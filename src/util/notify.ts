import {Match} from "../models";
import {Resolver} from "./resolver";
import {Message} from "discord.js";

export function notify() {
    Match.findAll()
        .then((matches: Match[]) => {
            const servers: string[] = [];
            matches.forEach(match => {
                if (!servers.includes(match.code!)) {
                    servers.push(match.code!);
                }
            });

            const response = servers.map(server => {
                const players = matches
                    .filter(match => match.code === server)
                    .map(match => match.player);
                const mentions = players
                    .map(player => `<@${player}>`)
                    .join(', ');
                return `${server} (${players.length} jugadores)\n${mentions}`
            }).join('\n\n');

            const messageRef = Resolver.get('message') as Message | number;
            if (messageRef === 0) {
                return;
            }

            (messageRef as Message).edit(response);
        });
}