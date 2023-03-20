import DisTube from "distube";
import {Awaitable, Client, ClientEvents,} from "discord.js";

export default interface UMClient extends Client {
    distube: DisTube;
    commands: any;
}

export interface EventI {
    name: keyof ClientEvents;
    once?: boolean;

    execute(...args: unknown[]): Awaitable<void>;
}
