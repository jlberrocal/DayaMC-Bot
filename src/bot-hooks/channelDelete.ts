import {TextChannel, VoiceChannel} from "discord.js";
import {BotChannel} from "../models";
import {prefix} from '../config.json';

export default function (channel: TextChannel | VoiceChannel) {
    console.log('a channel was deleted');
    const {guild} = channel;
    const generalChannel = guild.channels.find(c => c.id === guild.systemChannelID || c.type === 'text') as TextChannel;

    const serverType = (type: 'Voice' | 'Commands' | 'Codes') => {
        switch (type) {
            case 'Voice':
                return 'Voz';
            case 'Commands':
                return 'Comandos';
            case 'Codes':
                return 'Codigos';
        }
    };

    BotChannel.findOne({
        where: {
            channelId: channel.id
        }
    }).then(async (botChannel: BotChannel | null) => {
        if (botChannel) {
            console.log('it was required by bot');
            let logs = await guild.fetchAuditLogs({type: 72});
            let entry = logs.entries.first();
            botChannel.destroy()
                .then(() =>
                    generalChannel.send(`<@${guild.ownerID}> el chat de ${serverType(botChannel.type!)} ha sido eliminado por ${entry.executor}, por favor ejecuta \`${prefix}configure\` para recrearlo`)
                );
        }
    })
};
