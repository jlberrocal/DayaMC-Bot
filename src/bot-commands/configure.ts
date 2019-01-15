import {Command, GuildOnly, ICommand, RequireRole} from "../decorators";
import {GuildChannel, Message, Permissions} from "discord.js";
import {role} from "../config.json";
import {BotChannel} from "../models";

export class Configure implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    handle(message: Message): void {
        const commandsChannel = message.guild.channels.find(c => c.name === 'scrims-commands');
        const codesChannel = message.guild.channels.find(c => c.name === 'codigos');
        const voiceChannel = message.guild.channels.find(c => c.name === 'DayaMC Scrims' && c.type === 'voice');
        const {guild} = message;

        if (!commandsChannel) {
            guild.createChannel('scrims-commands', 'text', [
                {
                    deny: Permissions.FLAGS.SEND_MESSAGES,
                    id: guild.id
                },
                {
                    deny: Permissions.FLAGS.READ_MESSAGES,
                    id: guild.id
                }
            ]).then((channel: GuildChannel) => {
                channel.setTopic('Usa este canal para iniciar los conteos, debes pertenecer al rol ' + role);
                const botChannel = new BotChannel({
                    channelId: channel.id,
                    type: 'Commands',
                    guild: guild.id
                });

                botChannel.save()
                    .then(() => {
                        console.log('commands channel created');
                        return message.reply('He creado el chat para comandos, es probable que muchos no puedan ver este chat');
                    });
            });
        }

        if (!codesChannel) {
            guild.createChannel('codigos', 'text', [
                {
                    deny: Permissions.FLAGS.SEND_MESSAGES,
                    id: guild.id
                }
            ]).then((channel: GuildChannel) => {
                channel.setTopic('En este chat los jugadores enviarán el código del server');
                const botChannel = new BotChannel({
                    channelId: channel.id,
                    type: 'Codes',
                    guild: guild.id
                });

                botChannel.save()
                    .then(() => {
                        console.log('codes channel created');
                        return message.reply('He creado el chat para codigos');
                    });
            });
        }

        if (!voiceChannel) {
            guild.createChannel('DayaMC Scrims', 'voice', [
                {
                    deny: Permissions.FLAGS.SPEAK,
                    id: guild.id
                },
                {
                    allow: Permissions.FLAGS.MUTE_MEMBERS,
                    id: guild.id
                }
            ]).then((channel: GuildChannel) => {
                channel.setTopic('Por favor silencia tu micro para evitar interferencias o baneos');
                const botChannel = new BotChannel({
                    channelId: channel.id,
                    type: 'Voice',
                    guild: guild.id
                });

                botChannel.save()
                    .then(() => {
                        console.log('voice channel created');
                        return message.reply('He creado el canal de voz');
                    });
            });
        }
    }
}