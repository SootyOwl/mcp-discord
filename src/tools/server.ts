import { handleDiscordError } from "../errorHandler.js";
import { SearchMessagesSchema } from "../schemas.js";
import { ToolContext, ToolResponse } from "./types.js";


// Search server messages handler
export async function searchMessagesHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, authorId, mentions, has, maxId, minId, channelId, pinned, authorType, sortBy, sortOrder, limit, offset } = SearchMessagesSchema.parse(args);
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
        content: [{ type: "text", text: `Cannot find guild with ID: ${guildId}` }],
        isError: true
      };
    }

    // Note: Discord.js does not support guild message search natively.
    // This requires direct API calls or using a library that supports it.
    // Here we will construct the API request using context.client.rest
    const params = new URLSearchParams();
    if (authorId) params.append('author_id', authorId);
    if (mentions) params.append('mentions', mentions);
    if (has) params.append('has', has);
    if (maxId) params.append('max_id', maxId);
    if (minId) params.append('min_id', minId);
    if (channelId) params.append('channel_id', channelId);
    if (typeof pinned === 'boolean') params.append('pinned', String(pinned));
    if (authorType) params.append('author_type', authorType);
    if (sortBy) params.append('sort_by', sortBy);
    if (sortOrder) params.append('sort_order', sortOrder);
    params.append('limit', String(limit || 25));
    params.append('offset', String(offset || 0));

    const response = await context.client.rest.get(`/guilds/${guildId}/messages/search?${params.toString()}`);

    return {
      content: [{ type: "text", text: JSON.stringify(response, null, 2) }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}
