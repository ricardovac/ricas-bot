import path from "path";
import {REST, Routes} from "discord.js";
import fs from "fs";
import UMClient from "../structures/Client";
import {Command} from "../structures/Command";

// Create a new client instance
export default async function commandHandler(client: UMClient) {
    const commands: Command[] = [];

    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = await import(`../commands/${file}`);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        client.commands.set(command.default.data.name, command.default)
        commands.push(command.default);
    }

    // Construct and prepare an instance of the REST module
    // and deploy your commands!

    const rest = new REST({version: "10"}).setToken(process.env.DISCORD_TOKEN || '');
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );
        // The put method is used to fully refresh all commands in the guild with the current set
        const data: any = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''),
            {body: commands.map((command) => command.data.toJSON())}
        );

        console.log(commands)
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.log(error);
    }
}