import {
  ApplicationCommandType,
  Client,
  Events,
  GatewayIntentBits,
  TextChannel,
  ApplicationCommandOptionType
} from "discord.js";
import { Commands } from "../Commands";
import ask from '../prompt/openAI'
import {Player} from "discord-player";
import * as console from "console";

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
    if (message.content.substring(0, 3) === "!ai") {
      const prompt = message.content.substring(3); // remove the prefix
      const answer = await ask(prompt); // prompt GPT-3
      client.channels.fetch(message.channelId).then(channel => (channel as TextChannel).send(answer));
    }

    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
      await message.guild.commands.set([
        {
          name: "play",
          description: "Plays a song from youtube",
          options: [
            {
              name: "query",
              type: ApplicationCommandOptionType.String,
              description: "The song you want to play",
              required: true
            }
          ]
        },
        {
          name: "skip",
          description: "Skip to the current song"
        },
        {
          name: "queue",
          description: "See the queue"
        },
        {
          name: "stop",
          description: "Stop the player"
        },
      ]);

      await message.reply("Deployed!");
    }
  });

  const player = new Player(client);

  player.on("trackStart", (queue, track) => {
    // @ts-ignore
    queue.metadata.send(`🎶 | Started playing: **${track.title}** in **${queue.connection.channel.name}**!`);
  });

  player.on("trackAdd", (queue, track) => {
    // @ts-ignore
    queue.metadata.send(`🎶 | Track **${track.title}** queued!`);
  });

  player.on("botDisconnect", (queue) => {
    // @ts-ignore
    queue.metadata.send("❌ | I was manually disconnected from the voice channel, clearing queue!");
  });

  player.on("channelEmpty", (queue) => {
    // @ts-ignore
    queue.metadata.send("❌ | Nobody is in the voice channel, leaving...");
  });

  player.on("queueEnd", (queue) => {
    // @ts-ignore
    queue.metadata.send("✅ | Queue finished!");
  });
};