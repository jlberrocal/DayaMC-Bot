import {Client, Message, VoiceChannel} from 'discord.js';
import {token} from './config.json'
import {Sequelize} from 'sequelize-typescript';
import {Roles} from "./models/roles";
import {AudioChannel} from "./models/audioChannel";
import {createReadStream} from 'fs';
import {join} from 'path';

const client = new Client();
const db = new Sequelize({
    database: 'Screams',
    dialect: 'sqlite',
    storage: './db.sqlite',
    username: '',
    password: '',
    modelPaths: [__dirname + '/models'],
    modelMatch: ((filename, member) => {
        return filename.toLowerCase() === member.toLowerCase();
    })
});

const countdownPath = join(__dirname, 'sources', 'countdown.mp3');

let authorizedRoles: Roles[] = [];

db.sync().then(() => {
    console.log('db sync successfully');
});

client.on('message', (msg: Message) => {
    const message = msg.content;
    const {author} = msg;
    const {username, discriminator, id} = author;
    if (id === client.user.id) {
        return; //should do nothing if is a message from bot
    }

    const args = message.substring(1).split(' ');
    const command = args.shift();
    if (command) {
        switch (command) {
            case 'roles':
                Roles.findAll()
                    .then(roles =>
                        msg.reply(roles.map(r => r.name).join('\n'))
                    );
                break;
            case 'authorize':
                if (!msg.guild) {
                    return msg.reply('Solo puedo ejecutar esto dentro de un server no DMs');
                }
                if (!args || args.length === 0) {
                    return msg.reply('Debes decirme el nombre de al menos un rol');
                }
                args.forEach(roleName => {
                    if (msg.guild.roles.array().map(c => c.name).includes(roleName)) {
                        Roles.findOne({
                            where: {
                                name: roleName,
                                guild: msg.guild.id
                            }
                        }).then((role: Roles | null) => {
                            if (role) {
                                msg.reply(`El rol ${roleName} ya se encuentra autorizado`);
                                return;
                            }

                            Roles.create({
                                name: roleName,
                                guild: msg.guild.id
                            })
                                .then(() =>
                                    msg.reply(`Se ha autorizado a los usuarios del rol ${roleName}`)
                                )
                                .catch((err) => {
                                    console.error(err);
                                    msg.reply(`No se pudo autorizar el rol ${roleName}`);
                                });
                        });

                    } else {
                        msg.reply(`El rol ${roleName} no existe en el server`)
                    }
                });
                break;

            case 'set':
                if (!msg.guild) {
                    return msg.reply('Solo puedo ejecutar esto dentro de un server no DMs');
                }
                if (!args || args.length !== 1) {
                    return msg.reply('Debes decirme el nombre un canal de audio');
                }
                const channelName = args[0];

                const channel = msg.guild.channels.array().find(c => c.name === channelName);

                if (!channel) {
                    return msg.reply('No existe un canal de audio con este nombre');
                }

                AudioChannel.findOne({
                    where: {
                        guild: msg.guild.id
                    }
                }).then(vc => {
                    if (vc) {
                        vc.channelId = channel.id;
                        vc.save()
                            .then(() => msg.reply('Se ha cambiado el canal de audio'))
                            .catch((err) => {
                                console.error(err);
                                msg.reply(`No se pudo establecer el canal de voz a ${channelName}`);
                            });
                        return;
                    }

                    AudioChannel.create({
                        channelId: channel.id,
                        guild: msg.guild.id
                    })
                        .then(() =>
                            msg.reply(`Se ha establecido ${channel} como el canal de voz`)
                        )
                        .catch((err) => {
                            console.error(err);
                            msg.reply(`No se pudo establecer el canal de voz a ${channelName}`);
                        });
                });
                break;

            case 'start':
                AudioChannel
                    .findOne({
                        where: {
                            guild: msg.guild.id
                        }
                    })
                    .then(channel => {
                        if (!channel) {
                            msg.reply('Debes establecer primero el canal de audio, usa para ello el comando `!set {nombre del canal}`');
                            return;
                        }
                        return msg.guild.channels.array().find(c => c.id === channel.channelId && c.type === 'voice') as VoiceChannel;
                    })
                    .then((channel: VoiceChannel | undefined) => {
                        if (!channel) {
                            return;
                        }

                        channel
                            .join()
                            .then(con => {
                                const stream = createReadStream(countdownPath);
                                con.playStream(stream);
                            });
                    });
                break;
        }
    }
});

client.login(token).catch(err => console.error(err));