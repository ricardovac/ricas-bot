import {Command} from "../structures/Command";
import {SlashCommandBuilder} from "discord.js";
import {Configuration, OpenAIApi} from "openai";
import * as dotenv from "dotenv";

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_TOKEN
});
const openai = new OpenAIApi(configuration);

const ChatGPT: Command = {
    data: new SlashCommandBuilder()
        .setName("chatgpt")
        .setDescription("Discord artificial intelligence")
        .addStringOption(options =>
            options
                .setName("prompt")
                .setDescription("ChatGPT prompt")
                .setRequired(true)
        ),
    async execute(interaction) {
        const prompt = interaction.options.getString("prompt")
        await interaction.deferReply()

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            temperature: 0.5,
            max_tokens: 512,
            top_p: 1,
            n: 1,
            echo: false,
            best_of: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            prompt,
        });

        await interaction.editReply({
            content: `${response.data.choices[0].text}`
        })
    }
}

export default ChatGPT