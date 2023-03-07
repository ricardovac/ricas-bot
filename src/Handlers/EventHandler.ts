import path from "path";
import fs from 'fs'
import UMClient from "../structures/Client";
import {DisTubeEvent} from "../structures/DistubeEvent";

export default async function eventHandler(client: UMClient) {
    const distubePath = path.join(__dirname, "../Events/Distube");
    const distubeFiles = fs.readdirSync(distubePath).filter((file) => file.endsWith(".ts"));

    const eventsPath = path.join(__dirname, "../Events");
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

    for (const distubeFile of distubeFiles) {
        const event: DisTubeEvent = (await import(`../Events/Distube/${distubeFile}`)).event;
        client.distube.on(event.name, (...args: unknown[]) => event.execute(...args))
    }

    for (const file of eventFiles) {
        const event: DisTubeEvent = (await import(`../Events/${file}`)).event;
        client.distube.on(event.name, (...args: unknown[]) => event.execute(...args))
    }
}