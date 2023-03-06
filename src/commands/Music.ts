import {EmbedBuilder, GuildTextBasedChannel, SlashCommandBuilder} from "discord.js";
import {Command} from "../Command";

const Music: Command = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music system")
        .addSubcommand(option =>
            option
                .setName("play")
                .setDescription("Play a song")
                .addStringOption(option =>
                    option
                        .setName("query")
                        .setDescription("Provide a name or url for the song")
                        .setRequired(true)
                )
        )
        .addSubcommand(option =>
            option
                .setName("volume")
                .setDescription("Alter volume")
                .addStringOption(option =>
                    option
                        .setName("percent")
                        .setDescription("10 = 10%")
                        .setRequired(true)
                )
        )
        .addSubcommand(option =>
            option
                .setName("settings")
                .setDescription("Select an option")
                .addStringOption(option =>
                    option
                        .setName("options")
                        .setDescription("Select an option")
                        .setRequired(true)
                        .addChoices(
                            {name: "queue", value: "queue"},
                            {name: "skip", value: "skip"},
                            {name: "resume", value: "resume"},
                            {name: "stop", value: "stop"}
                        )
                )
        ),
    /*
     * @param {ChatInputCommandInteraction<'cached'>} interaction
     * @param {UMClient} client
     */
    async execute(interaction, client) {
        const {options, guild, channel} = interaction
        const member = await interaction.guild?.members.fetch(interaction.user)

        const voiceChannel = member?.voice.channel

        if (!voiceChannel) {
            return interaction.reply({content: "You must be in a voice channel", ephemeral: true})
        }

        if (guild?.members.me?.voice.channelId && voiceChannel.id !== guild.members.me.voice.channelId) {
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
                        options.getString("query", true),
                        {
                            member: member,
                            textChannel: channel as GuildTextBasedChannel
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

                    // Skipping, Pausing, Resuming and queue commands
                    switch (options.getString("options")) {
                        case "skip": {
                            await queue.skip()
                            return interaction.reply({content: "Song has been skipped."})
                        }
                        case "stop": {
                            await queue.stop()
                            return interaction.reply({content: "Music has been stopped."})
                        }
                        case "pause": {
                            await queue.pause()
                            return interaction.reply({content: "Music has been paused."})
                        }
                        case "resume": {
                            await queue.resume()
                            return interaction.reply({content: "Music has been resumed."})
                        }
                        case "queue": {
                            return interaction.reply({
                                embeds: [new EmbedBuilder()
                                    .setColor("DarkPurple")
                                    .setDescription(`${queue.songs.map(
                                        (song, id) => `\n**${id + 1}** ${song.name} - \`${song.formattedDuration}\``
                                    )}`)
                                ]
                            })
                        }
                    }
                    return
                }
            }
        } catch (e) {
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Alert: ${e}`)
            return interaction.reply({embeds: [errorEmbed]})
        }
    }
}

export default Music