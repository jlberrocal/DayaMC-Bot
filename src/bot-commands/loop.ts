import {Command, ICommand} from "../decorators/command";
import {Message} from "discord.js";

export class Loop implements ICommand{

    @Command()
    handle(message: Message): void {
        message.reply('ToDo');
    }
}