import {Client, Collection, GatewayIntentBits, PermissionFlagsBits} from "discord.js";
import * as dotenv from "dotenv";
import clientEvents from "./listeners/client";
import DisTube from "distube";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import UMClient from "./types/common/discord";
import path from "path";
import fs from "fs";
import interactionCreate from "./listeners/interactionCreate";
import commandHandler from "./Handlers/CommandHandler";

dotenv.config();
const token = process.env.DISCORD_TOKEN;

console.log("Bot is starting...");
console.log("Attempting to create a new client instance...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
}) as UMClient;

client.commands = new Collection()

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
        }),
        new SoundCloudPlugin()
    ]
})


clientEvents(client);
interactionCreate(client)
commandHandler()

client.login(token);

export default client