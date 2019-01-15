import {Match} from "../models";
import {notify} from "../util";

export default function () {
    Match.afterUpdate('notifyOnChannel', notify);
}