import {EmbedBuilder, Events, TextChannel} from "discord.js";
import * as dotenv from 'dotenv'
import UMClient from "../Structures/Client";

dotenv.config()

export default (client: UMClient): void => {
    client.once(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            return;
        }

        console.log(`${client.user.username} is online`);
    });

    client.on(Events.MessageCreate, async (message) => {
        const prefix = '>'

        if (!message.content.startsWith(prefix) || message.author.bot) return

        const args = message.content.slice(prefix.length).split(/ +/)
        const command = args.shift()?.toLowerCase()

        // Message array
        const messageArray = message.content.split(" ")
        const argument = messageArray.slice(1) // Message
        const cmd = messageArray[0] // Prefix command

        if (command === 'test') {
            const channel = message.channel as TextChannel
            await channel.send("Working!!!");
        }

        if (command === 'avatar' || command === 'av') {
            const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;

            const avatar = user.avatarURL({size: 1024, extension: "png", forceStatic: false});

            const embed = new EmbedBuilder()
                .setColor("Purple")
                .setTitle(`Avatar de ${user.username}`)
                .setImage(avatar)
                .setFooter({text: `${message.author.tag}`, iconURL: `${message.author.avatarURL()}`});
            await message.channel.send({embeds: [embed]});
        }
    })
};
