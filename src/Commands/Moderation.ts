import {Command} from "../Structures/Command";
import {EmbedBuilder, PermissionsBitField, SlashCommandBuilder, UserResolvable} from "discord.js";

const Moderation: Command = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Here you can moderate your discord server')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ModerateMembers)
        .addSubcommand(options =>
            options
                .setName('ban')
                .setDescription('Ban a server member')
                .addUserOption(options =>
                    options
                        .setName('bantarget')
                        .setDescription('The user you would like to ban')
                        .setRequired(true)
                )
                .addStringOption(options =>
                    options
                        .setName('banreason')
                        .setDescription('The reason for banning the user')
                )
        )
        .addSubcommand(options =>
            options
                .setName('banlist')
                .setDescription('See all the banned users')
        )
        .addSubcommand(options =>
            options
                .setName('kick')
                .setDescription('Kick a server member')
                .addUserOption(options =>
                    options
                        .setName('kicktarget')
                        .setDescription('The user you would like to kick')
                        .setRequired(true)
                )
                .addStringOption(options =>
                    options
                        .setName('kickreason')
                        .setDescription('The reason for kicking the user')
                )
        )
        .addSubcommand(options =>
            options
                .setName('unban')
                .setDescription('Unban a server member by ID (use /mod banlist to see the ID)')
                .addStringOption(options =>
                    options
                        .setName('id')
                        .setDescription('ID')
                        .setRequired(true)
                )
        )
        .addSubcommand(options =>
            options
                .setName("setnick")
                .setDescription("Set nickname for a member")
                .addUserOption(options =>
                    options
                        .setName('usernick')
                        .setDescription('Provide member')
                        .setRequired(true)
                )
                .addStringOption(options =>
                    options
                        .setName('nickname')
                        .setDescription('Provide nickname')
                        .setRequired(true)
                )
        )
        .addSubcommand(options =>
            options
                .setName('mute')
                .setDescription("Mutes a user in the server.")
                .addUserOption(options =>
                    options
                        .setName('muteuser')
                        .setDescription('The user to mute')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('reason')
                        .setDescription('The reason for the mute.')
                        .setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('unmute')
                .setDescription('Unmutes a user.')
                .addUserOption(option =>
                    option.setName('unmuteuser')
                        .setDescription('The user to unmute.')
                        .setRequired(true))),
    async execute(interaction) {
        const {guild, member, options} = interaction;

        try {
            switch (options.getSubcommand()) {
                case "banlist": {
                    interaction.guild.bans.fetch()
                        .then(async bans => {
                            if (bans.size == 0) return await interaction.reply({
                                content: "There is nobody banned from this server",
                                ephemeral: true
                            })
                            let username = bans.map(user => user.user.username).join('\n');
                            let userID = bans.map(user => user.user.id).join('\n');
                            if (username.length >= 1950) username = `${username.slice(0, 1948)}`;
                            const banListEmbed = new EmbedBuilder()
                                .setTitle("Banned users")
                                .setColor("Purple")
                                .setDescription('Here is a list of banned users on this server: ')
                                .addFields({
                                    name: "--------------------------------------------",
                                    value: `**Name**: ${username} - **ID**: ${userID}`
                                })

                            return interaction.reply({
                                embeds: [banListEmbed],
                                ephemeral: true
                            });
                        })
                        .catch(console.error);
                    break
                }
                case "ban": {
                    const banUser = options.getUser('bantarget')
                    const banID = await guild.members.fetch(banUser!.id)
                    let reason = options.getString('banreason');
                    if (!reason) reason = "No reason given."
                    if (!banID) {
                        return await interaction.reply({
                            content: "The user you mentioned is no longer on the server",
                            ephemeral: true
                        })
                    }
                    if (!banID.bannable) {
                        return await interaction.reply({
                            content: "I cannot ban this user because they have roles above me or you",
                            ephemeral: true
                        })
                    }

                    // Embeds
                    const banDmEmbed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("You have been banned!")
                        .setDescription("You have been banned from the server.")
                        .addFields(
                            {name: 'Server', value: guild.name, inline: true},
                            {name: 'Reason', value: reason, inline: true},
                            {
                                name: 'Appeal',
                                value: 'If you believe this ban was made in error, please contact the server staff.'
                            },
                        )
                        .setTimestamp()

                    await banID.send({embeds: [banDmEmbed]}).catch(async (e) => {
                        await interaction.editReply({content: e})
                    })
                    await banID.ban().catch(async () => {
                    })

                    return await interaction.reply({
                        content: `Banned ${banID.user.tag} for **${reason}**`,
                        ephemeral: true
                    })
                }
                case "kick": {
                    const kickUser = options.getUser('kicktarget')
                    const kickMember = await guild.members.fetch(kickUser!.id)
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
                    let reason = options.getString('kickreason')
                    if (!reason) reason = "No reason given."

                    const kickDmEmbed = new EmbedBuilder()
                        .setColor("#ff0000")
                        .setTitle("You have been kicked!")
                        .setDescription("You have been kicked from the server.")
                        .addFields(
                            {name: 'Server', value: guild.name, inline: true},
                            {name: 'Reason', value: reason, inline: true},
                            {
                                name: 'Appeal',
                                value: 'If you believe this kick was made in error, please contact the server staff.'
                            },
                        )
                        .setTimestamp()

                    await kickMember.send({embeds: [kickDmEmbed]}).catch(async (e) => {
                        return await interaction.reply({content: e, ephemeral: true})
                    })

                    await kickMember.kick(reason).catch(async () => {
                    })

                    return await interaction.reply({
                        content: `Kicked ${kickUser?.tag} for **${reason}**`,
                        ephemeral: true
                    })
                }
                case "unban": {
                    const target = options.getString('id')

                    await guild.bans.fetch()
                        .then(async bans => {
                            if (bans.size == 0) return await interaction.reply({
                                content: "There is nobody banned from this server",
                                ephemeral: true
                            })
                            const bannedID = bans.find(ban => ban.user.id == target);
                            if (!bannedID) return await interaction.reply({
                                content: "The ID stated is not banned from this server",
                                ephemeral: true
                            })
                            await interaction.guild.bans.remove(target as UserResolvable).catch(err => console.error(err))

                            await interaction.reply({
                                content: `Unbanned ${bannedID.user.tag}`,
                                ephemeral: true
                            })
                        })
                        .catch(err => console.log(err))
                    break
                }
                case "setnick": {
                    const user = options.getUser("usernick")
                    const member = guild.members.cache.get(user!.id)
                    const nick = options.getString('nickname')

                    member?.setNickname(`${nick}`).then(async () => {
                        await interaction.reply({
                            content: `Successfully changed \`${user?.tag}'s\` nickname to \`${nick}\``,
                            ephemeral: true
                        })
                    }).catch(async e => {
                        await interaction.reply({
                            content: `${e}`,
                            ephemeral: true
                        })
                    })
                    break
                }
                case "mute": {
                    const targetUser = interaction.options.getUser('muteuser');
                    const reason = interaction.options.getString('reason') ?? 'No reason specified.';
                    const targetMember = guild.members.cache.get(targetUser!.id);

                    if (!targetMember) {
                        return await interaction.reply({
                            content: 'Could not find the specified user.',
                            ephemeral: true
                        });
                    }
                    if (targetMember.roles.cache.some(role => role.name === 'Muted')) {
                        return await interaction.reply({
                            content: 'This user is already muted.',
                            ephemeral: true
                        });
                    }

                    const mutedRole = guild.roles.cache.find(role => role.name === 'Muted');
                    if (!mutedRole) {
                        return await interaction.reply({
                            content: 'Could not find the "Muted" role. Please create it first.',
                            ephemeral: true
                        });
                    }

                    try {
                        await targetMember.roles.add(mutedRole);
                        await interaction.reply({
                            content: `Muted ${targetUser?.tag} for reason: ${reason}`,
                            ephemeral: true
                        });
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({
                            content: 'Could not mute the user.',
                            ephemeral: true
                        });
                    }
                    break
                }
                case "unmute": {
                    const targetUser = interaction.options.getUser('unmuteuser');
                    const targetMember = guild.members.cache.get(targetUser!.id);

                    if (!targetMember?.roles.cache.some(role => role.name === 'Muted')) {
                        return interaction.reply({content: 'This user is not muted.', ephemeral: true});
                    }

                    const mutedRole = guild.roles.cache.find(role => role.name === 'Muted');
                    if (!mutedRole) {
                        return interaction.reply({
                            content: 'Could not find the "Muted" role. Please create it first.',
                            ephemeral: true
                        });
                    }

                    try {
                        await targetMember.roles.remove(mutedRole);
                        await interaction.reply({content: `Unmuted ${targetUser?.tag}.`, ephemeral: true});
                    } catch (error) {
                        console.error(error);
                        await interaction.reply({content: 'Could not unmute the user.', ephemeral: true});
                    }
                }
            }
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Alert: ${e}`)
            return interaction.editReply({embeds: [errorEmbed]})
        }
    }
}

export default Moderation