import {Client, ChatInputCommandInteraction } from "discord.js";
import { Commands } from "../Commands";
import {Player} from "discord-player";

export default (client: Client): void => {
  const player = new Player(client);
  // @ts-ignore
  player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))

  client.on("interactionCreate", async (interaction: any) => {
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }

    // /play track:Despacito
    // will play "Despacito" in the voice channel
    if (interaction.commandName === "play") {
      if (!interaction.member.voice.channelId) return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
      if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
      const query = interaction.options.getString("query");
      const queue = player.createQueue(interaction.guild, {
        metadata: {
          channel: interaction.channel
        }
      });

      // verify vc connection
      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        queue.destroy();
        return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
      }

      const track = await player.search(query, {
        requestedBy: interaction.user
      }).then(x => x.tracks[0]);
      if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

      await queue.play(track);

      return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction,
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.followUp({content: "An error has occurred"});
    return;
  }

  await interaction.deferReply();
};
