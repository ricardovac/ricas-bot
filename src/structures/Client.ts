import DisTube from "distube";
import {Client} from "discord.js";

export default interface UMClient extends Client {
    distube: DisTube,
    commands: any,
}