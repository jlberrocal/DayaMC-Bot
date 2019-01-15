import {Guild} from "discord.js";

export default function (guild: Guild) {
    const channel = guild.channels.find(c => c.id === guild.systemChannelID || c.type === 'text') as any;
    console.log(`Bot added to ${guild.name} server`);
    channel.send('thank you for adding me to your server');
};
