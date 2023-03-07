import {BaseGuildTextChannel} from 'discord.js';
import {Events} from 'distube';
import {DisTubeEvent} from "../structures/DistubeEvent";

export const event: DisTubeEvent = {
    name: Events.ERROR,
    async execute(channel: BaseGuildTextChannel, error: Error) {
        if (channel) await channel.send(`There was an error encountered: ${error.message}`);
        console.log(error);
    },
};