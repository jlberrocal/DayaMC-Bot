import * as config from '../config.json'
import {writeFile} from "fs";
import {promisify} from 'util';

const write = promisify(writeFile);

export class AuthorizationHandler {

    static authorize(users: string[]): Promise<string> {
        const info: string[] = [];

        if (!users || users.length === 0) {
            return Promise.resolve(config.authorizedUsers.join(", "));
        }

        users.forEach(user => {
            if (config.authorizedUsers.indexOf(user) > -1) {
                info.push(`${user} ya está autorizado`);
            } else if (!/.+#\d+/.test(user)) {
                info.push(`${user}, el formato debe ser user#123`);
            } else {
                config.authorizedUsers.push(user);
                info.push(`${user} agregado como un usuario autorizado`);
            }
        });

        return write('../config.json', JSON.stringify(config))
            .then(() => info.join('\n'));
    }
}