import {Client, CommandInteraction, GuildTextBasedChannel, MessageEmbed} from "discord.js";

export const Music = {
    name: "music",
    description: "Music system",
    options: [
        {
            name: "play",
            description: "Play a song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "query",
                    description: "Provide a name or url for the song",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "volume",
            description: "Alter volume",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "percent",
                    description: "10 = 10%",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
        {
            name: "settings",
            description: "Select an option",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option,",
                    type: "STRING",
                    required: true,
                    choices: [
                        {name: "queue", value: "queue"},
                        {name: "skip", value: "skip"},
                        {name: "resume", value: "resume"},
                        {name: "stop", value: "stop"},
                    ]
                }
            ],
        }
    ],
    /*
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: CommandInteraction<"cached">, client: Client) {
        const {options, member, guild, channel} = interaction
        const voiceChannel = member.voice.channel

        if (!voiceChannel) {
            return interaction.reply({content: "You must be in a voice channel", ephemeral: true})
        }

        if (guild.members.me?.voice.channelId && voiceChannel.id !== guild.members.me.voice.channelId) {
            return interaction.reply({
                content: `Already playing music in ${guild.members.me.voice.channelId}`,
                ephemeral: true
            })
        }

        try {
            switch (options.getSubcommand()) {
                case "play": {
                    await client.distube.play(
                        voiceChannel,
                        options.getString("query") || '',
                        {
                            textChannel: channel as GuildTextBasedChannel || undefined,
                            member: member
                        }
                    )
                    return interaction.reply({
                        content: "Request received"
                    })
                }
                case "volume": {
                    const Volume = options.getNumber("percent") || 0

                    // Volume validation
                    if (Volume > 100 || Volume < 1) {
                        return await interaction.reply({
                            content: "You have to specify a number between 1 and 100.",
                            ephemeral: true
                        })
                    }

                    // Set the volume
                    client.distube.setVolume(voiceChannel, Volume)
                    return interaction.reply({
                        content: `Volume has been set to ${Volume}`,
                        ephemeral: true
                    })
                }
                case "settings": {
                    const queue = await client.distube.getQueue(voiceChannel)
                    if (!queue) {
                        return interaction.reply({
                            content: "There is no queue",
                            ephemeral: true
                        })
                    }
                }
            }
        } catch (e) {
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`Alert: ${e}`)
            return interaction.reply({embeds: [errorEmbed]})
        }
    }
}
