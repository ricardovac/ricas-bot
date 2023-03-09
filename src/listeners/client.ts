import {Client, Events} from "discord.js";
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
};