import {Client, ChatInputCommandInteraction, GuildMember} from "discord.js";
import { Commands } from "../Commands";

export default (client: Client): void => {
  client.on("interactionCreate", async (interaction: any) => {
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }

    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
      return void interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
    }

    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return void interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: ChatInputCommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    await interaction.followUp({content: "An error has occurred"});
    return;
  }

  await interaction.deferReply();

  slashCommand.run(client, interaction);
};
