import {Match} from "../models";
import {Resolver} from "./resolver";
import {Message, RichEmbed} from "discord.js";

export function notify() {
    Match.findAll()
        .then((matches: Match[]) => {
            const servers: string[] = [];
            matches.forEach(match => {
                if (!servers.includes(match.code!)) {
                    servers.push(match.code!);
                }
            });

            const embed = new RichEmbed()
                .setTitle('**Agrupamiento**');

            servers.forEach(server => {
                const players = matches
                    .filter(match => match.code === server)
                    .map(match => match.player);
                const mentions = players
                    .map(player => `<@${player}>`)
                    .join(', ');
                embed.addField(server, mentions);
            });

            const messageRef = Resolver.get('message') as Message | number;
            if (messageRef === 0) {
                return;
            }

            embed.setFooter('total de jugadores: ' + matches.length);

            (messageRef as Message).edit({embed});
        });
}