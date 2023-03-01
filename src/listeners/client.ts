import {Client, Events, Message, TextChannel} from "discord.js";
import {Commands} from "../Commands";
import ask from '../prompt/openAI'
import * as dotenv from 'dotenv'
import {RepeatMode} from 'discord-music-player';

dotenv.config()

export default (client: Client): void => {
    client.once(Events.ClientReady, async () => {
        if (!client.user || !client.application) {
            return;
        }
        // Registering Slash Commmands
        await client.application.commands.set(Commands);

        console.log(`${client.user.username} is online`);
    });

    client.on(Events.MessageCreate, async (message: Message) => {
        if (message.content.substring(0, 3) === "!ai") {
            const prompt = message.content.substring(3); // remove the prefix
            const answer = await ask(prompt); // prompt GPT-3
            client.channels.fetch(message.channelId).then(channel => (channel as TextChannel).send(answer));
        }

        // Music core

        const settings = {
            prefix: '!',
        };

        const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
        const command = args.shift();
        let guildQueue = client.player.getQueue(message.guild?.id);

        if (command === 'play') {
            let queue = client.player.createQueue(message.guild?.id);
            await queue.join(message.member?.voice.channel);
            let song = await queue.play(args.join(' ')).catch((err: any) => {
                console.log(err);
                if (!guildQueue)
                    queue.stop();
            });
        }

        if (command === 'playlist') {
            let queue = client.player.createQueue(message.guild?.id);
            await queue.join(message.member?.voice.channel);
            let song = await queue.playlist(args.join(' ')).catch((err: any) => {
                console.log(err);
                if (!guildQueue)
                    queue.stop();
            });
        }

        if (command === 'skip') {
            guildQueue.skip();
        }

        if (command === 'stop') {
            guildQueue.stop();
        }

        if (command === 'removeLoop') {
            guildQueue.setRepeatMode(RepeatMode.DISABLED); // or 0 instead of RepeatMode.DISABLED
        }

        if (command === 'toggleLoop') {
            guildQueue.setRepeatMode(RepeatMode.SONG); // or 1 instead of RepeatMode.SONG
        }

        if (command === 'toggleQueueLoop') {
            guildQueue.setRepeatMode(RepeatMode.QUEUE); // or 2 instead of RepeatMode.QUEUE
        }

        if (command === 'setVolume') {
            guildQueue.setVolume(parseInt(args[0]));
        }

        if (command === 'seek') {
            guildQueue.seek(parseInt(args[0]) * 1000);
        }

        if (command === 'clearQueue') {
            guildQueue.clearQueue();
        }

        if (command === 'shuffle') {
            guildQueue.shuffle();
        }

        if (command === 'getQueue') {
            console.log(guildQueue);
        }

        if (command === 'getVolume') {
            console.log(guildQueue.volume)
        }

        if (command === 'nowPlaying') {
            console.log(`Now playing: ${guildQueue.nowPlaying}`);
        }

        if (command === 'pause') {
            guildQueue.setPaused(true);
        }

        if (command === 'resume') {
            guildQueue.setPaused(false);
        }

        if (command === 'remove') {
            guildQueue.remove(parseInt(args[0]));
        }

        if (command === 'createProgressBar') {
            const ProgressBar = guildQueue.createProgressBar();

            // [======>              ][00:35/2:20]
            console.log(ProgressBar.prettier);
        }

        if (command === 'move') {
            guildQueue.move(parseInt(args[0]), parseInt(args[1]));
        }
    });
};