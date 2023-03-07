import {
    ChatInputCommandInteraction,
    InteractionResponse,
    Message,
    SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import UMClient from "./Client";

export interface Command {
    data:
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand">;
    execute: (interaction: ChatInputCommandInteraction<'cached'>, client: UMClient) => Promise<InteractionResponse<true> | Message<boolean> | undefined>
}