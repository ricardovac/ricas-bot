import path from "path";
import fs from "fs";
import UMClient from "../Structures/Client";
import {DisTubeEvent} from "../Structures/DistubeEvent";

export default async function eventHandler(client: UMClient) {
    const distubePath = path.join(__dirname, "../Events/Distube");
    const distubeFiles = fs
        .readdirSync(distubePath)
        .filter((file) => file.endsWith(".ts"));

    for (const distubeFile of distubeFiles) {
        const event: DisTubeEvent = (
            await import(`../Events/Distube/${distubeFile}`)
        ).event;
        client.distube.on(event.name, (...args: unknown[]) =>
            event.execute(...args)
        );
    }
}
