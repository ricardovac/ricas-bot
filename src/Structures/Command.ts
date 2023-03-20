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
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (interaction: ChatInputCommandInteraction<'cached'>, client: UMClient) => Promise<InteractionResponse<true> | Message<boolean> | void>
}