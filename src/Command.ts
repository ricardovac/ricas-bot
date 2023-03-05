import {ChatInputCommandInteraction, InteractionResponse, SlashCommandSubcommandsOnlyBuilder,} from "discord.js";
import UMClient from "./types/common/discord";

export interface Command {
    data:
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand">;
    execute: (interaction: ChatInputCommandInteraction, client: UMClient) => Promise<InteractionResponse<true> | undefined>
}