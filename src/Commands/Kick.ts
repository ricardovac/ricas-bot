import {Command} from "../Structures/Command";
import {EmbedBuilder, PermissionsBitField, SlashCommandBuilder} from "discord.js";

const Kick: Command = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a server member')
        .addUserOption(options =>
            options
                .setName('target')
                .setDescription('The user you would like to kick')
                .setRequired(true)
        )
        .addStringOption(options =>
            options
                .setName('reason')
                .setDescription('The reason for kicking the user')
        ),
    async execute(interaction, client) {
        const {options, guild, channel, member} = interaction
        const kickUser = options.getUser('target')
        const kickMember = await guild.members.fetch(kickUser!.id)

        if (!member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return await interaction.reply({
                content: "You don't have **Kick Members** permission to execute this command",
                ephemeral: true
            })
        }
        if (!kickMember) {
            return await interaction.reply({
                content: "The user you mentioned is no longer on the server",
                ephemeral: true
            })
        }

        if (!kickMember.kickable) {
            return await interaction.reply({
                content: "I cannot kick this user because they have roles above me or you",
                ephemeral: true
            })
        }

        let reason = options.getString('reason')
        if (!reason) reason = "No reason given."

        const dmEmbed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(`:x: You have been kicked from **${guild.name} | ${reason}**`)

        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setDescription(`:x: ${kickUser?.tag} has been **kicked** | ${reason}`)

        await kickMember.send({embeds: [dmEmbed]}).catch(err => {
            return
        })

        await kickMember.kick(reason).catch(async err => {
            await interaction.reply({content: "There was an error", ephemeral: true})
        })

        await interaction.reply({embeds: [embed]})
    }
}

export default Kick;