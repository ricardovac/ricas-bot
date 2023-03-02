import * as dotenv from "dotenv";
import {ApplicationCommandType} from "discord.js";

dotenv.config()

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: process.env.OPENAI_TOKEN
});

const openai = new OpenAIApi(configuration);
async function ask(prompt: any) {
    const response = await openai.createCompletion({
        model: "text-davinci-002",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        prompt,
    });
    return response.data.choices[0].text
}

export default ask
