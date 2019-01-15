import {Match} from "../models";
import {notify} from "../util";

export default function () {
    Match.afterCreate('notifyOnChannel', notify);
}