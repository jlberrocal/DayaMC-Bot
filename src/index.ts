import {Client} from 'discord.js';
import {token} from './config.json'
import {join} from 'path';
import {initializeDb, loadBotHooks, MessagesHandler, Resolver} from "./util";

const client = new Client();
initializeDb([
    __dirname + '/models/**/*.model.ts',
    __dirname + '/models/**/*.model.js'
]);

Resolver.register('bot', client);
Resolver.register('message', 0);
Resolver.register('timeout', 0);
Resolver.register('sources-path', join(__dirname, '..', 'sources'));

loadBotHooks(join(__dirname, 'bot-hooks'));

const handler = new MessagesHandler(join(__dirname, 'bot-commands'));
Resolver.register('messageHandler', handler);

client.login(token)
    .catch(err => console.error(err));