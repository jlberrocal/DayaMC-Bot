import {Guild} from "discord.js";

export default function (guild: Guild) {
    const channel = guild.channels.find(c => c.id === guild.systemChannelID || c.type === 'text') as any;
    channel.send('thank you for adding me to your server');
};
