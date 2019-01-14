import {Match} from "../models/match";
import {notify} from "../util/notifyFn";

export default function () {
    Match.afterUpdate('notifyOnChannel', notify);
}