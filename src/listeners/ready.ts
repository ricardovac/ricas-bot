import {Client, Events, GatewayIntentBits, TextChannel} from "discord.js";
import { Commands } from "../Commands";
import ask from '../utils/AI'

export default (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }

    // Registering Slash Commmands
    await client.application.commands.set(Commands);

    console.log(`${client.user.username} is online`);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.content.substring(0, 1) === "!") {
      const prompt = message.content.substring(1); //remove the exclamation mark from the message
      const answer = await ask(prompt); //prompt GPT-3
      client.channels.fetch(message.channelId).then(channel => (channel as TextChannel).send(answer));
    }
  });
};
