import {Events, Queue} from 'distube';
import {DisTubeEvent} from "../Command";

export const event: DisTubeEvent = {
    name: Events.FINISH,
    async execute(queue: Queue) {
        // @ts-ignore
        await queue.textChannel?.send('No more songs left in the queue.');
    },
};