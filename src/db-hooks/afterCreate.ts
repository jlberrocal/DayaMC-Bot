import {Match} from "../models/match";
import {notify} from "../util/notify";

export default function () {
    Match.afterCreate('notifyOnChannel', notify);
}