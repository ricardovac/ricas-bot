import {DisTubeEvents} from "distube";

export interface DisTubeEvent {
    name: keyof DisTubeEvents;

    execute(...args: unknown[]): void | Promise<void>;
}