import {Command} from "../Structures/Command";
import {PermissionFlagsBits, SlashCommandBuilder} from "discord.js";
import ms from 'ms'

const Clear: Command = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('It clears your chat!')
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addIntegerOption(options =>
            options
                .setName('amount')
                .setDescription('Specify a number of messages')
                .setRequired(true)
        ),
    async execute(interaction) {
        const {options, channel} = interaction
        const amount = options.getInteger("amount")

        if (amount! > 100) {
            return interaction.followUp({
                content: "The maximum amount of messages you can delete is 100 messages",
            })
        }

        const messages = await channel?.messages.fetch({
            limit: amount! + 1,
        })

        const filtered = messages!.filter(
            (msg) => Date.now() - msg.createdTimestamp < ms("14 days")
        )

        await interaction.channel?.bulkDelete(filtered)

        await interaction.reply({
            content: `Deleted ${filtered?.size! - 1} messages`
        }).then((msg) => {
            setTimeout(() => msg.delete(), ms("5 seconds"))
        })
    }
}

export default Clear;