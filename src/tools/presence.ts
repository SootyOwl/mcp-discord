import { ActivityType, PresenceStatusData } from "discord.js";
import { handleDiscordError } from "../errorHandler.js";
import {
  SetAboutMeSchema,
  SetBioSchema,
  SetNicknameSchema,
  SetPresenceSchema
} from "../schemas.js";
import { ToolContext, ToolResponse } from "./types.js";

// Set bot presence handler
export async function setPresenceHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { status, afk, activity_name, activity_type } = SetPresenceSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    // map activity_type string to ActivityType enum
    const activityTypeMap: Record<string, ActivityType> = {
      Playing: ActivityType.Playing,
      Streaming: ActivityType.Streaming,
      Listening: ActivityType.Listening,
      Watching: ActivityType.Watching,
      Competing: ActivityType.Competing,
      Custom: ActivityType.Custom
    };
    context.client.user.setPresence({
      status: status as PresenceStatusData,
      afk: afk,
      activities: activity_name && activity_type ? [{
        name: activity_name,
        type: activityTypeMap[activity_type]
      }] : []
    });

    if (activity_name && activity_type) {
      return {
        content: [{ type: "text", text: `Successfully set bot presence to: ${status} with activity: ${activity_type} - ${activity_name}` }]
      };
    } else {
      return {
        content: [{ type: "text", text: `Successfully set bot presence to: ${status} with no activity.` }]
      };
    }
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Set nickname handler
export async function setNicknameHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, nick } = SetNicknameSchema.parse(args);
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

    await guild.members.editMe({ nick: nick ?? null, reason: "Updating bot nickname via tool" });

    return {
      content: [{ type: "text", text: `Successfully set nickname to: ${nick}` }]
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
    await context.client.application.edit({ description: aboutMe });

    return {
      content: [{ type: "text", text: `Successfully updated about me section.` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

export async function setBioHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, bio } = SetBioSchema.parse(args);
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
    await guild.members.editMe({ bio: bio ?? null, reason: "Updating bot bio via tool" });

    return {
      content: [{ type: "text", text: `Successfully updated bio in guild ${guildId}.` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}