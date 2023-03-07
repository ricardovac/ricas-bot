import {Events, Interaction, PermissionFlagsBits} from "discord.js";
import UMClient from "../structures/Client";

export default (client: UMClient): void => {
    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            const slashCommand = client.commands.get(interaction.commandName)
            if (!slashCommand) return;

            try {
                await slashCommand.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }
    })
}