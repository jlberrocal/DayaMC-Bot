import {TextChannel} from "discord.js";
import {AuthorizationHandler} from "./AuthorizationHandler";
import {PermissionsHandler} from "./PermissionsHandler";
import {timer} from "rxjs";
import {map, take} from "rxjs/operators";
import {timeout} from "../config.json";
import {CodesHandler} from "./CodesHandler";

export class CommandsHandler {
    private enableTimeout: NodeJS.Timeout | null = null;
    private handler: PermissionsHandler;
    private counterRunning = false;

    constructor(private codesChannel: TextChannel) {
        this.handler = new PermissionsHandler(codesChannel);
    }

    handle(message: string, countChannel: TextChannel, callback: (resp: string) => void): void {
        const args = message.substring(1).split(' ');
        const command = args.shift();

        if (!command) {
            throw new Error('no command passed');
        }

        switch (command.toLowerCase()) {
            case 'ping':
                return callback('Pong!');

            case 'authorize':
                AuthorizationHandler.authorize(args).then(callback);
                break;

            case 'start':
                if (this.counterRunning)
                    return callback('Actualmente hay un conteo en ejecución, debes cancelarlo antes de iniciar otro con el comando `cancel`' +
                        '');
                this.counterRunning = true;
                CodesHandler.reset(this.codesChannel);

                timer(0, 1000)
                    .pipe(
                        take(4),
                        map(i => 3 - i)
                    )
                    .subscribe(i => {
                        countChannel.send(i !== 0 ? i : 'Vamos!!!!');
                        if (i === 0) {
                            const ref = setImmediate(() => {
                                this.handler.grant();
                                clearImmediate(ref);
                                this.enableTimeout = setTimeout(this.cancelTimeout.bind(this), timeout);
                            });
                        }
                    });
                break;

            case 'cancel':
                return this.cancelTimeout();

            default:
                return callback('No conozco ese comando');
        }
    }

    private cancelTimeout(): void {
        this.handler.revoke();
        this.counterRunning = false;
        if (this.enableTimeout) {
            clearTimeout(this.enableTimeout);
        }
    }
}