import { z } from "zod";
import { ToolContext, ToolResponse } from "./types.js";
import {
  SetPresenceSchema,
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
