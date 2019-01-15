import {Resolver} from "../util/resolver";
import {Client} from "discord.js";
import {prefix} from "../config.json";

export default function () {
    console.log('bot ready');
    const client = Resolver.get('bot') as Client;

    client.user.setActivity(`Type ${prefix}help`, {
        type: 'LISTENING'
    });
};

