import {ChatInputCommandInteraction, InteractionResponse, SlashCommandSubcommandsOnlyBuilder,} from "discord.js";
import {DisTubeEvents} from "distube";
import UMClient from "./types/common/discord";

export interface Command {
    data:
        | SlashCommandSubcommandsOnlyBuilder
        | Omit<SlashCommandSubcommandsOnlyBuilder, "addSubcommand">;
    execute: (interaction: ChatInputCommandInteraction<'cached'>, client: UMClient) => Promise<InteractionResponse<true> | undefined>
}

export interface DisTubeEvent {
    name: keyof DisTubeEvents;

    execute(...args: unknown[]): void | Promise<void>;
}