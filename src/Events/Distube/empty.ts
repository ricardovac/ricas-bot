import {Events, Queue} from 'distube';
import {DisTubeEvent} from "../../structures/DistubeEvent";

export const event: DisTubeEvent = {
    name: Events.EMPTY,
    async execute(queue: Queue) {
        // @ts-ignore
        await queue.textChannel?.send(`<#${queue.voiceChannel?.id}> is empty, leaving the voice channel.`);
    },
};