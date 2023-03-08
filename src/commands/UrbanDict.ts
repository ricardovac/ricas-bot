import {Command} from "../structures/Command";
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
                .setDescription(answer.word)
                .setURL(answer.permalink)
                .addFields({name: "Definition: ", value: `${answer.definition}`})
                .addFields({name: "Example: ", value: `${answer.example}`})
            ]
        })
    }
}

export default UrbanDict