import {Client, Events, Message, TextChannel} from "discord.js";
import ask from '../functions/openAI'
import * as dotenv from 'dotenv'

dotenv.config()

export default (client: Client): void => {
    client.once(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            return;
        }

        console.log(`${client.user.username} is online`);
    });

    client.once(Events.ShardReconnecting, async () => {
        if (!client.user || !client.application) {
            return;
        }

        console.log(`${client.user.username} is reconneting`);
    })

    client.once(Events.ShardDisconnect, async () => {
        if (!client.user || !client.application) {
            return;
        }
        console.log(`${client.user.username} is disconnecting`);
    })

    client.on(Events.MessageCreate, async (message: Message) => {
        if (message.content.substring(0, 3) === "!ai") {
            const prompt = message.content.substring(3); // remove the prefix
            const answer = await ask(prompt); // prompt GPT-3
            client.channels.fetch(message.channelId).then(channel => (channel as TextChannel).send(answer));
        }
    });
};