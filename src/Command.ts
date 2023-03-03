import {CommandInteraction, InteractionResponse, SlashCommandSubcommandsOnlyBuilder,} from "discord.js";
import UMClient from "./types/common/discord";

export type CommandRunArgs = {
    interaction: CommandInteraction<'cached'>;
    client: UMClient;
};

export interface Command {
    data:
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand">;
    run: (args: CommandRunArgs) => Promise<InteractionResponse<true> | undefined>
}