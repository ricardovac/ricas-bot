import {Client, Collection, GatewayIntentBits, PermissionFlagsBits} from "discord.js";
import * as dotenv from "dotenv";
import clientEvents from "./listeners/client";
import DisTube from "distube";
import SpotifyPlugin from "@distube/spotify";
import SoundCloudPlugin from "@distube/soundcloud";
import UMClient from "./types/common/discord";
import process from "process";
import interactionCreate from "./listeners/interactionCreate";
import commandHandler from "./Handlers/CommandHandler";
import eventHandler from "./Handlers/EventHandler";

dotenv.config()
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

client.commands = new Collection()

commandHandler(client)
eventHandler(client)
interactionCreate(client)
clientEvents(client)

client.login(token)

export default client