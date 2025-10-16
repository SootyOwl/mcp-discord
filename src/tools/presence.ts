import { z } from "zod";
import { ToolContext, ToolResponse } from "./types.js";
import { 
  SetBotStatusSchema, 
  SetBotActivitySchema 
} from "../schemas.js";
import { handleDiscordError } from "../errorHandler.js";
import { ActivityType, PresenceStatusData } from "discord.js";

// Set bot status handler
export async function setBotStatusHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { status } = SetBotStatusSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    // Set the bot's status
    await context.client.user?.setStatus(status as PresenceStatusData);

    return {
      content: [{ type: "text", text: `Successfully set bot status to: ${status}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Set bot activity/presence handler
export async function setBotActivityHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { activityType, activityName, url } = SetBotActivitySchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    // Map activity type string to ActivityType enum
    const activityTypeMap: Record<string, ActivityType> = {
      "playing": ActivityType.Playing,
      "streaming": ActivityType.Streaming,
      "listening": ActivityType.Listening,
      "watching": ActivityType.Watching,
      "competing": ActivityType.Competing,
      "custom": ActivityType.Custom
    };

    const mappedActivityType = activityTypeMap[activityType];
    if (mappedActivityType === undefined) {
      return {
        content: [{ type: "text", text: `Invalid activity type: ${activityType}. Must be one of: playing, streaming, listening, watching, competing, custom` }],
        isError: true
      };
    }

    // Build activity options
    const activityOptions: any = {
      name: activityName,
      type: mappedActivityType
    };

    // Add URL for streaming activity
    if (activityType === "streaming" && url) {
      activityOptions.url = url;
    }

    // Set the bot's activity
    await context.client.user?.setActivity(activityOptions);

    let responseText = `Successfully set bot activity to: ${activityType} "${activityName}"`;
    if (activityType === "streaming" && url) {
      responseText += ` at ${url}`;
    }

    return {
      content: [{ type: "text", text: responseText }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}
