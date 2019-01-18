import {Command, GuildOnly, ICommand, RequireCommandsChannel, RequireRole, RequireVoiceChannel} from "../decorators";
import {Message} from "discord.js";
import {role} from "../config.json";
import {NoRunningMatch} from "../decorators/no-running-match";
import {merge, timer} from "rxjs";
import {map} from "rxjs/operators";
import {TimerEnum} from "../models/timer.enum";

export class Loop implements ICommand {

    @Command()
    @GuildOnly()
    @RequireRole(role)
    @NoRunningMatch()
    @RequireCommandsChannel()
    @RequireVoiceChannel()
    handle(message: Message): void {
        merge(
            //timer(5 * 60 * 1000).pipe(map(() => TimerEnum._5MIN)),
            timer(60 * 1000).pipe(map(() => TimerEnum._1MIN)),
            timer(30 * 1000).pipe(map(() => TimerEnum._30SEC)),
            timer(5 * 1000).pipe(map(() => TimerEnum._5SEC))
        ).subscribe((period: TimerEnum) => {
            console.log(period);
        });
    }
}