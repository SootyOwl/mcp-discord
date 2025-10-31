import { ChannelType } from "discord.js";
import { handleDiscordError } from "../errorHandler.js";
import { GetServerInfoSchema, ListServersSchema, SearchMessagesSchema } from "../schemas.js";
import { SearchMessage, SearchMessagesResponse, ToolContext, ToolResponse } from "./types.js";

// Helper function to remove null/undefined values from an object
function removeNulls<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(item => removeNulls(item)) as unknown as T;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined) {
        (acc as any)[key] = removeNulls(value);
      }
      return acc;
    }, {} as Partial<T>) as T;
  }
  return obj;
}

// Search server messages handler
export async function searchMessagesHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, content, authorId, mentions, has, maxId, minId, channelId, pinned, authorType, sortBy, sortOrder, limit, offset } = SearchMessagesSchema.parse(args);
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
    if (content) params.append('content', content);
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
    if (limit) params.append('limit', String(limit));
    if (offset) params.append('offset', String(offset));

    const response = await context.client.rest.get(`/guilds/${guildId}/messages/search?${params.toString()}`) as unknown as SearchMessagesResponse;

    if (!response || !response.messages || !Array.isArray(response.messages)) {
      return {
        content: [{ type: "text", text: "Failed to retrieve search results." }],
        isError: true
      };
    }

    // Transform the response to clean up author and remove nulls
    const cleanedMessages: SearchMessage[][] = response.messages.map((messageGroup: any[]) =>
      messageGroup.map((msg: any) => removeNulls({
        ...msg,
        author: msg.author
          ? {
            id: msg.author.id,
            username: msg.author.username,
            global_name: msg.author.global_name
          }
          : null
      }))
    );

    const cleanedResponse: SearchMessagesResponse = {
      messages: cleanedMessages,
      doing_deep_historical_index: response.doing_deep_historical_index,
      total_results: response.total_results
    };

    return {
      content: [{ type: "text", text: JSON.stringify(cleanedResponse, null, 2) }],
      structuredContent: cleanedResponse
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// List servers handler
export async function listServersHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  ListServersSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    const guilds = await context.client.guilds.fetch();

    if (guilds.size === 0) {
      return {
        content: [{ type: "text", text: "No servers found. The bot is not a member of any servers." }]
      };
    }

    const guildsInfo = guilds.map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL()
    }));

    return {
      content: [{ type: "text", text: JSON.stringify(guildsInfo, null, 2) }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Server information handler
export async function getServerInfoHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId } = GetServerInfoSchema.parse(args);
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

    // Fetch additional server data
    await guild.fetch();

    // Fetch channel information
    const channels = await guild.channels.fetch();

    // Categorize channels by type
    const channelsByType = {
      text: channels.filter(c => c?.type === ChannelType.GuildText).size,
      voice: channels.filter(c => c?.type === ChannelType.GuildVoice).size,
      category: channels.filter(c => c?.type === ChannelType.GuildCategory).size,
      forum: channels.filter(c => c?.type === ChannelType.GuildForum).size,
      announcement: channels.filter(c => c?.type === ChannelType.GuildAnnouncement).size,
      stage: channels.filter(c => c?.type === ChannelType.GuildStageVoice).size,
      total: channels.size
    };

    // Get detailed information for all channels
    const channelDetails = channels.map(channel => {
      if (!channel) return null;

      return {
        id: channel.id,
        name: channel.name,
        type: ChannelType[channel.type] || channel.type,
        categoryId: channel.parentId,
        position: channel.position,
        // Only add topic for text channels
        topic: 'topic' in channel ? channel.topic : null,
      };
    }).filter(c => c !== null); // Filter out null values


    // Group channels by type
    const groupedChannels = {
      text: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildText] || c.type === ChannelType.GuildText),
      voice: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildVoice] || c.type === ChannelType.GuildVoice),
      category: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildCategory] || c.type === ChannelType.GuildCategory),
      forum: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildForum] || c.type === ChannelType.GuildForum),
      announcement: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildAnnouncement] || c.type === ChannelType.GuildAnnouncement),
      stage: channelDetails.filter(c => c.type === ChannelType[ChannelType.GuildStageVoice] || c.type === ChannelType.GuildStageVoice),
      all: channelDetails
    };

    // Get member count
    const approximateMemberCount = guild.approximateMemberCount || "unknown";

    // Format guild information
    const guildInfo = {
      id: guild.id,
      name: guild.name,
      description: guild.description,
      icon: guild.iconURL(),
      owner: guild.ownerId,
      createdAt: guild.createdAt,
      memberCount: approximateMemberCount,
      channels: {
        count: channelsByType,
        details: groupedChannels
      },
      features: guild.features,
      premium: {
        tier: guild.premiumTier,
        subscriptions: guild.premiumSubscriptionCount
      }
    };

    return {
      content: [{ type: "text", text: JSON.stringify(guildInfo, null, 2) }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

