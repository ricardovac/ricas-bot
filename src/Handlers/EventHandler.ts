import path from "path";
import fs from 'fs'
import UMClient from "src/types/common/discord";
import { DisTubeEvent } from "src/Command";

export default async function eventHandler(client: UMClient) {
    const eventsPath = path.join(__dirname, "../Events");
    const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

    for (const file of eventFiles) {
      const event: DisTubeEvent = (await import(`../Events/${file}`)).event;
      client.distube.on(event.name, (...args: unknown[]) => event.execute(...args))
    }
}