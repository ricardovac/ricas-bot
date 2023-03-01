import client from '../../Bot'
import {Queue} from "distube";
import {MessageEmbed} from "discord.js";

const status = (queue: Queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
        queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

client.distube
    .on("playSong", (queue, song) => queue.textChannel?.send(
        {
            embeds: [new MessageEmbed()
                .setColor("PURPLE")
                .setDescription(`| Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`)
            ]
        }
    ))
    .on('addSong', (queue, song) => queue.textChannel?.send(
        {
            embeds: [new MessageEmbed()
                .setColor("PURPLE")
                .setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user?.tag}`)]
        }
    ))
    .on('addList', (queue, song) => queue.textChannel?.send(
        {
            embeds: [new MessageEmbed()
                .setColor("PURPLE")
                .setDescription(`| Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)]
        }
    ))
    .on('finish', (queue) => queue.textChannel?.send(
        {
            embeds: [new MessageEmbed()
                .setColor("PURPLE")
                .setDescription("Queue has been finished.")
            ]
        }
    ))
    // .on('finishSong', (queue) => queue.textChannel?.send(`Song has finished playing.`))
    // .on('disconnect', (queue) => queue.textChannel?.send('Disconnected.'))
    .on('empty', (queue) => queue.textChannel?.send(
        {
            embeds: [new MessageEmbed()
                .setColor("PURPLE")
                .setDescription("Voice channel is empty. Exiting...")
            ]
        }
    ))
    .on('error', (channel, e) => {
        if (channel) channel.send(
            {
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`| An error encountered: ${e.toString().slice(0, 1974)}`)
                ]
            }
        )
        else console.error(e)
    })