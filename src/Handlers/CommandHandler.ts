import {APIUser, REST, Routes} from "discord.js";
import * as process from "process";
import path from "path";
import fs from "fs";
import {Command} from "../Command";

export default async function () {
    const commands: Command[] = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const command = await import(`../commands/${file}`);
        commands.push(command.default);
    }

    const rest = new REST({version: '10'}).setToken(process.env.DISCORD_TOKEN || '');
    try {
        console.log(commands)
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''),
            {body: commands.map((command) => command.data.toJSON())},
        );

        console.log(data)
        console.log(`Successfully reloaded  application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}
