import {Match} from "../models/match";
import {notify} from "./notifyFn";

export default function () {
    Match.afterUpdate('notifyOnChannel', notify);
}