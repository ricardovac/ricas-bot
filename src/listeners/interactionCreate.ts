import {Events, PermissionFlagsBits} from "discord.js";
import UMClient from "../types/common/discord";

export default (client: UMClient): void => {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const slashCommand = client.commands.get(interaction.commandName)
        if (!slashCommand) return

        try {
            await slashCommand.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: 'There was an error while executing this command!',
                    ephemeral: true
                });
            } else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    })
}