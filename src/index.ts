import {Client, Message, TextChannel} from 'discord.js';
import {authorizedUsers, token} from './config.json'
import {AfterLogin} from "./util/after-login";
import {CommandsHandler} from "./util/CommandsHandler";
import {CodesHandler} from "./util/CodesHandler";

const client = new Client();
let codesChannel: TextChannel;
let countChannel: TextChannel;
let commands: CommandsHandler;
let codes: CodesHandler;

client.on('message', (msg: Message) => {
    const message = msg.content;
    const {author} = msg;
    const {username, discriminator, id} = author;

    if (message.startsWith("!") && authorizedUsers.includes(`${username}#${discriminator}`)) {
        commands.handle(message, countChannel, resp => msg.channel.send(resp));
    }

    if (msg.channel === codesChannel) {
        codes.handle(msg, message.toUpperCase(), id, client.user.id);
    }
});

client.login(token)
    .then(() => {
        const handler = new AfterLogin(client);
        return handler.handle();
    })
    .then(channels => {
        countChannel = channels[0];
        // countChannel.send("ready to rock & roll");
        codesChannel = channels[1];
        commands = new CommandsHandler(codesChannel);
        codes = new CodesHandler(codesChannel);
    })
    .catch(err => console.error(err));