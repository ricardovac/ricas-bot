import {Command} from "../Structures/Command";
import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import axios from "axios";

const UrbanDict: Command = {
    data: new SlashCommandBuilder()
        .setName("urbandict")
        .setDescription("Search for a word/slang")
        .addStringOption(options =>
            options
                .setName("word")
                .setDescription("Provide a word to search on urbandictionary")
                .setRequired(true)
        ),
    /*
     * @param {ChatInputCommandInteraction<'cached'>} interaction
     */
    async execute(interaction) {
        const {options} = interaction

        const word = options.getString("word")
        const data = await axios.get(`https://api.urbandictionary.com/v0/define?term=${word}`)
            .then(res => res.data.list)
        const [answer] = data

        await interaction.reply({
            embeds: [new EmbedBuilder()
                .setColor("Purple")
                .setDescription(`${await interaction.guild.members.fetch(interaction.user.id)} wants to know what **${answer.word}** means`)
                .setURL(answer.permalink)
                .addFields({
                    name: "Definition: ",
                    value: `${answer.definition.length > 1024 ? `${answer.definition.slice(0, 1020)}...` : answer.definition}`
                })
                .addFields({
                    name: "Example: ",
                    value: `${answer.example.length > 1024 ? `${answer.example.slice(0, 1020)}...` : answer.example}`
                })
            ]
        })
    }
}

export default UrbanDict
