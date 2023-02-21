import { Client } from 'discord.js'
import * as dotenv from 'dotenv'
import ready from './listeners/ready'
dotenv.config()

const token = process.env.DISCORD_TOKEN;

console.log("Bot is starting...")

const client = new Client({
  intents: []
});

ready(client)

client.login(token)
