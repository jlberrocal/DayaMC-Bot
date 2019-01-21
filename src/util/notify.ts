import {Match} from "../models";
import {Message, RichEmbed} from "discord.js";

export function notify(messageRef: Message) {
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

            embed.setFooter('total de jugadores: ' + matches.length);

            messageRef.edit({embed});
        });
}