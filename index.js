const {Client, Message} = require('discord.js');
const {token, serverId, testServerId, authorizedUsers} = require('./src/config.json');

const afterLogin = require('./util/after-login');
const handleCommands = require('./util/handle-commands');
const handleCodesMessage = require('./util/handle-codes-message');

let codesChannel, countChannel;
const currentServerId = testServerId;
const client = new Client();
const match = new Map();

client.on('message', async (msg) => {
    const message = msg.content;
    const {author} = msg;
    const {username, discriminator, id} = author;

    if (message.startsWith("!") && authorizedUsers.includes(`${username}#${discriminator}`)) {
        handleCommands(msg, message, countChannel, codesChannel, currentServerId, match)
            .then(resp => console.log(resp instanceof Message));
    }

    if (msg.channel === codesChannel) {
        handleCodesMessage(msg, message, client.user.id, match, id);
    }
});

client.login(token)
    .then(() => afterLogin(client, currentServerId))
    .then(channels => {
        countChannel = channels[0];
        countChannel.send("ready to rock & roll");
        codesChannel = channels[1];
    })
    .catch(err => console.error(err));