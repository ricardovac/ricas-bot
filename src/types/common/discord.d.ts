import DisTube, { DisTubeEvents } from "distube";
import {Client} from "discord.js";

export default interface UMClient extends Client {
    distube: DisTube, 
    commands: any,
}

export interface DisTubeEvent {
    name: keyof DisTubeEvents;
    execute(...args: unknown[]): void | Promise<void>;
}