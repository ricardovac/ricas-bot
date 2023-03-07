import {EmbedBuilder} from 'discord.js';
import {Events, Queue, Song} from 'distube';
import {DisTubeEvent} from 'src/structures/DistubeEvent';

export const event: DisTubeEvent = {
    name: Events.PLAY_SONG,
    async execute(queue: Queue, song: Song) {
        const playSongEmbed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle(song.name || '')
            .setURL(song.url)
            .setAuthor({
                name: song.user?.tag || '',
                iconURL: song.user?.displayAvatarURL({size: 512}),
            })
            .setDescription(`Song length: ${queue.formattedDuration}`)
            .setThumbnail(song.thumbnail ?? 'https://images.emojiterra.com/mozilla/512px/1f4bf.png')
            .addFields(
                {
                    name: 'Volume',
                    value: `${queue.volume.toString()}%`,
                    inline: true,
                },
                {
                    name: 'Looping',
                    value: queue.repeatMode
                        ? (queue.repeatMode === 2
                            ? 'All queue'
                            : 'This song')
                        : 'Off',
                    inline: true,
                },
                {
                    name: 'Autoplay',
                    value: queue.autoplay ? 'On' : 'Off',
                    inline: true,
                },
                {
                    name: 'Filters',
                    value: queue.filters.names.join(', ') || 'None',
                },
            );

        //@ts-ignore
        await queue.textChannel?.send({
            content: '**Now playing:**',
            embeds: [playSongEmbed],
        });
    },
};