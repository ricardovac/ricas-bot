import {Command} from "../Structures/Command";
import {
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    PermissionFlagsBits,
    PermissionsBitField,
    SlashCommandBuilder,
    TextChannel
} from "discord.js";

const Poll: Command = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll.")
        .addStringOption(options =>
            options
                .setName("question")
                .setDescription("Provide the question of the poll")
                .setRequired(true)
        )
        .addChannelOption(options =>
            options.setName("channel")
                .setDescription("Where do you want to send the poll")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        ),
    /*
     * @param {ChatInputCommandInteraction<'cached'>} interaction
     */
    async execute(interaction) {
        const {options, member} = interaction
        const channel = options.getChannel("channel")
        const pollQuestion = options.getString("question")

        if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return await interaction.reply({
                content: "You don't have **Administrator** permission to execute this command",
                ephemeral: true
            })
        }

        const embed = new EmbedBuilder()
            .setTitle('😲 New Poll! 😲')
            .setDescription("**Question:**\n" + pollQuestion)
            .setColor([104, 204, 156])
            .setTimestamp()

        try {
            const message = await (channel as TextChannel)?.send({embeds: [embed]})
            await message.react("👍")
            await message.react("👎")
            await interaction.reply({content: "Poll was sent to the channel.", ephemeral: true})
        } catch (e) {
            console.log(e)
        }
    }
}

export default Poll