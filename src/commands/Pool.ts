import {Command} from "../structures/Command";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder
} from "discord.js";

const Pool: Command = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll.")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(options =>
            options
                .setName("question")
                .setDescription("Provide the question of the pool")
                .setRequired(true)
        ),    
    /*
     * @param {ChatInputCommandInteraction<'cached'>} interaction
     * @param {UMClient} client
     */
    async execute(interaction, client) {
        const pollQuestion = interaction.options.getString("question")

        const replyObject = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription("**Question:**\n" + pollQuestion)
                    .setImage("https://i.ibb.co/vxdBKFd/Untitled-1.gif")
                    .addFields([
                        {name: "Yes's", value: "0", inline: true},
                        {name: "No's", value: "0", inline: true}
                    ])
                    .setColor([104, 204, 156])

            ], fetchReply: true
        })

        const pollButtons: any = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Yes")
                    .setCustomId(`Poll-Yes${replyObject.id}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("No")
                    .setCustomId(`Poll-No${replyObject.id}`)
                    .setStyle(ButtonStyle.Danger),
            )

        await interaction.editReply({components: [pollButtons]})
    }
}

export default Pool