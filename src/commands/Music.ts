import {Client, CommandInteraction} from "discord.js";

export const Music = {
    name: "music",
    description: "Music system",
    options: [
        {
            name: "play",
            description: "Play a song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "query",
                    description: "Provide a name or url for the song",
                    type: "STRING",
                    required: true
                },
            ]
        },
        {
            name: "volume",
            description: "Alter volume",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "percent",
                    description: "10 = 10%",
                    type: "NUMBER",
                    required: true
                },
            ]
        },
        {
            name: "settings",
            description: "Select an option",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option,",
                    type: "STRING",
                    required: true,
                    choices: [
                        {name: "queue", value: "queue"},
                        {name: "skip", value: "skip"},
                        {name: "resume", value: "resume"},
                        {name: "stop", value: "stop"},
                    ]
                }
            ],
        }
    ],
    /*
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction: CommandInteraction<"cached">, client: Client) {
    }
}
