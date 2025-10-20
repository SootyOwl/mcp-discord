import { ToolContext, ToolResponse } from "./types.js";
import {
  SetPresenceSchema,
  SetAboutMeSchema,
  SetNicknameSchema
} from "../schemas.js";
import { handleDiscordError } from "../errorHandler.js";
import { ActivityType, PresenceStatusData } from "discord.js";

// Set bot presence handler
export async function setPresenceHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { status, afk, activities } = SetPresenceSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    // Map activity type string to ActivityType enum
    const activityTypeMap: Record<string, ActivityType> = {
      "PLAYING": ActivityType.Playing,
      "STREAMING": ActivityType.Streaming,
      "LISTENING": ActivityType.Listening,
      "WATCHING": ActivityType.Watching,
      "COMPETING": ActivityType.Competing,
      "CUSTOM": ActivityType.Custom
    };
    // Set the bot's presence
    context.client.user?.setPresence({
      status: status as PresenceStatusData,
      afk: afk ?? false,
      activities: activities
        ? [{
          name: activities.name,
          type: activityTypeMap[activities.type],
          url: activities.url
        }]
        : []
    });

    return {
      content: [{ type: "text", text: `Successfully set bot presence to: ${status}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Set nickname handler
export async function setNicknameHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, nickname } = SetNicknameSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    const guild = await context.client.guilds.fetch(guildId);
    if (!guild) {
      return {
        content: [{ type: "text", text: `Guild with ID ${guildId} not found.` }],
        isError: true
      };
    }
    const member = await guild.members.fetch(context.client.user!.id);
    if (!member) {
      return {
        content: [{ type: "text", text: `Bot is not a member of guild ${guildId}.` }],
        isError: true
      };
    }
    // Set the bot's nickname
    await member.setNickname(nickname);

    return {
      content: [{ type: "text", text: `Successfully set nickname to: ${nickname}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Set bot about me handler
export async function setAboutMeHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { aboutMe } = SetAboutMeSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    // Set the bot's about me (bio)
    await context.client.application.edit({ description: aboutMe });

    return {
      content: [{ type: "text", text: `Successfully updated about me section.` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}