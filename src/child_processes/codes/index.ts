import {timeout, token} from '../../config.json';
import {BotChannel} from "../../models";
import {Client, Message, TextChannel} from "discord.js";
import {initializeDb} from "../../util";
import {join} from "path";
import {MessageHandler} from "./message-handler";
import {cleanUp} from "./clean-up";

const [guild] = process.argv.slice(2);

initializeDb([
    join(__dirname, '../..', 'models/**/*.model.ts'),
    join(__dirname, '../..', 'models/**/*.model.js')
]);

const client = new Client();
let messageRef: Message;
let codesChannel: TextChannel;
const handler = new MessageHandler();

client.on('message', (message: Message) => {
    const {author} = message;
    if (client.user.equals(author)) {
        return; // do nothing to own messages
    }

    handler.handle(message, messageRef);
});

client.on('ready', () => {
    BotChannel.findOne({
        where: {
            guild,
            type: 'Codes'
        }
    })
        .then((channel: BotChannel | null) => {
            if (!channel) {
                return
            }
            codesChannel = client.channels.find(c => c.id === channel.channelId) as TextChannel;

            if (!codesChannel) {
                return;
            }

            codesChannel.overwritePermissions(guild, {
                SEND_MESSAGES: true
            });

            codesChannel.send('Esperando a los jugadores')
                .then((msg: Message | Message[]) => {
                    messageRef = msg as Message;
                    setTimeout(() => cleanUp(codesChannel, guild, messageRef, client), timeout);
                });
        })
        .catch(err => {
            console.error(err);
            process.exit(0);
        });
});

client.login(token)
    .catch(err => {
        console.error(err);
        process.exit(0)
    });

process.addListener('message', (msg: string) => {
    switch (msg) {
        case 'cancel':
            return cleanUp(codesChannel, guild, messageRef, client);
        default:
            console.log('ignoring process command');
    }
});