import { z } from "zod";
import { ChannelType } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { ToolContext, ToolResponse } from "./types.js";
import { 
  CreateTextChannelSchema, 
  DeleteChannelSchema, 
  ReadMessagesSchema,
  GetServerInfoSchema,
  CreateCategorySchema,
  EditCategorySchema,
  DeleteCategorySchema,
  SearchGuildMessagesSchema
} from "../schemas.js";
import { handleDiscordError } from "../errorHandler.js";

  // Category creation handler
export async function createCategoryHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, name, position, reason } = CreateCategorySchema.parse(args);
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
    const options: any = { name, type: ChannelType.GuildCategory };
    if (typeof position === "number") options.position = position;
    if (reason) options.reason = reason;
    const category = await guild.channels.create(options);
    return {
      content: [{ type: "text", text: `Successfully created category "${name}" with ID: ${category.id}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Category edit handler
export async function editCategoryHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { categoryId, name, position, reason } = EditCategorySchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    const category = await context.client.channels.fetch(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return {
        content: [{ type: "text", text: `Cannot find category with ID: ${categoryId}` }],
        isError: true
      };
    }
    const update: any = {};
    if (name) update.name = name;
    if (typeof position === "number") update.position = position;
    if (reason) update.reason = reason;
    await category.edit(update);
    return {
      content: [{ type: "text", text: `Successfully edited category with ID: ${categoryId}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Category deletion handler
export async function deleteCategoryHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { categoryId, reason } = DeleteCategorySchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }
    const category = await context.client.channels.fetch(categoryId);
    if (!category || category.type !== ChannelType.GuildCategory) {
      return {
        content: [{ type: "text", text: `Cannot find category with ID: ${categoryId}` }],
        isError: true
      };
    }
    await category.delete(reason || "Category deleted via API");
    return {
      content: [{ type: "text", text: `Successfully deleted category with ID: ${categoryId}` }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

  // Text channel creation handler
export async function createTextChannelHandler(
  args: unknown, 
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, channelName, topic, reason } = CreateTextChannelSchema.parse(args);
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

    // Create the text channel
    const channelOptions: any = {
      name: channelName,
      type: ChannelType.GuildText
    };
    if (topic) channelOptions.topic = topic;
    if (reason) channelOptions.reason = reason;
    const channel = await guild.channels.create(channelOptions);

    return {
      content: [{ 
        type: "text", 
        text: `Successfully created text channel "${channelName}" with ID: ${channel.id}` 
      }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Channel deletion handler
export async function deleteChannelHandler(
  args: unknown, 
  context: ToolContext
): Promise<ToolResponse> {
  const { channelId, reason } = DeleteChannelSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    const channel = await context.client.channels.fetch(channelId);
    if (!channel) {
      return {
        content: [{ type: "text", text: `Cannot find channel with ID: ${channelId}` }],
        isError: true
      };
    }

    // Check if channel can be deleted (has delete method)
    if (!('delete' in channel)) {
      return {
        content: [{ type: "text", text: `This channel type does not support deletion or the bot lacks permissions` }],
        isError: true
      };
    }

    // Delete the channel
    await channel.delete(reason || "Channel deleted via API");

    return {
      content: [{ 
        type: "text", 
        text: `Successfully deleted channel with ID: ${channelId}` 
      }]
    };
  } catch (error) {
    return handleDiscordError(error);
  }
}

// Message reading handler
export async function readMessagesHandler(
  args: unknown, 
  context: ToolContext
): Promise<ToolResponse> {
  const { channelId, limit } = ReadMessagesSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    const channel = await context.client.channels.fetch(channelId);
    if (!channel) {
      return {
        content: [{ type: "text", text: `Cannot find channel with ID: ${channelId}` }],
        isError: true
      };
    }

    // Check if channel has messages (text channel, thread, etc.)
    if (!channel.isTextBased() || !('messages' in channel)) {
      return {
        content: [{ type: "text", text: `Channel type does not support reading messages` }],
        isError: true
      };
    }

    // Fetch messages
    const messages = await channel.messages.fetch({ limit });
    
    if (messages.size === 0) {
      return {
        content: [{ type: "text", text: `No messages found in channel` }]
      };
    }

    // Format messages 
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      author: {
        id: msg.author.id,
        username: msg.author.username,
        bot: msg.author.bot
      },
      timestamp: msg.createdAt,
      attachments: msg.attachments.size,
      embeds: msg.embeds.length,
      replyTo: msg.reference ? msg.reference.messageId : null
    })).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          channelId,
          messageCount: formattedMessages.length,
          messages: formattedMessages
        }, null, 2) 
      }]
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

// Guild message search handler
export async function searchGuildMessagesHandler(
  args: unknown,
  context: ToolContext
): Promise<ToolResponse> {
  const { guildId, content, authorId, channelId, limit } = SearchGuildMessagesSchema.parse(args);
  try {
    if (!context.client.isReady()) {
      return {
        content: [{ type: "text", text: "Discord client not logged in." }],
        isError: true
      };
    }

    // Verify guild exists
    const guild = await context.client.guilds.fetch(guildId);
    if (!guild) {
      return {
        content: [{ type: "text", text: `Cannot find guild with ID: ${guildId}` }],
        isError: true
      };
    }

    // Build query parameters for the search
    const queryParams: Record<string, string> = {};
    if (content) queryParams.content = content;
    if (authorId) queryParams.author_id = authorId;
    if (channelId) queryParams.channel_id = channelId;
    if (limit) queryParams.limit = limit.toString();

    // Use the undocumented search endpoint
    // Note: This is an undocumented Discord API endpoint
    const endpoint = `/guilds/${guildId}/messages/search` as any;
    
    try {
      const searchResults = await context.client.rest.get(endpoint, { 
        query: new URLSearchParams(queryParams)
      }) as any;

      // Check if we got results
      if (!searchResults || !searchResults.messages || searchResults.messages.length === 0) {
        return {
          content: [{ type: "text", text: "No messages found matching the search criteria" }]
        };
      }

      // Format the search results
      const formattedResults = searchResults.messages.map((messageGroup: any[]) => {
        // Each result is an array with the matching message and context
        const message = messageGroup[0]; // The first message is the match
        return {
          id: message.id,
          content: message.content,
          author: {
            id: message.author.id,
            username: message.author.username,
            discriminator: message.author.discriminator
          },
          channelId: message.channel_id,
          timestamp: message.timestamp,
          attachments: message.attachments?.length || 0,
          embeds: message.embeds?.length || 0
        };
      });

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            guildId,
            totalResults: searchResults.total_results || formattedResults.length,
            messages: formattedResults
          }, null, 2)
        }]
      };
    } catch (apiError: any) {
      // If the endpoint is not available or returns an error
      if (apiError.status === 404 || apiError.status === 405) {
        return {
          content: [{
            type: "text",
            text: "Guild message search is not available. This feature uses an undocumented Discord API endpoint that may not be accessible with bot tokens."
          }],
          isError: true
        };
      }
      throw apiError;
    }
  } catch (error) {
    return handleDiscordError(error);
  }
} 