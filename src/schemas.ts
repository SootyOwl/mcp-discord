import { z } from "zod";

export const DiscordLoginSchema = z.object({
    token: z.string({ description: "The bot token to use for login." }).optional()
}, {
    description: "Login to Discord using a bot token. If no token is provided, the bot will attempt to use the token from the environment variable DISCORD_TOKEN."
});

export const SendMessageSchema = z.object({
    channelId: z.string({ description: "The ID of the channel to send the message to." }),
    message: z.string({ description: "The content of the message to send." }),
    replyToMessageId: z.string({ description: "The ID of the message to reply to, if any." }).optional()
}, {
    description: "Send a message to a specified channel, optionally as a reply to another message."
});

export const GetForumChannelsSchema = z.object({
    guildId: z.string({ description: "The ID of the server (guild) to get forum channels from." })
}, {
    description: "Get all forum channels in a specified server (guild)."
});

export const CreateForumPostSchema = z.object({
    forumChannelId: z.string({ description: "The ID of the forum channel where the thread will be created." }),
    title: z.string({ description: "The title of the forum post (thread)." }),
    content: z.string({ description: "The body content of the forum post." }),
    tags: z.array(z.string({ description: "A tag to attach to the forum post." })).optional()
}, {
    description: "Create a new forum post (thread) in a specified forum channel."
});

export const GetForumPostSchema = z.object({
    threadId: z.string({ description: "The ID of the forum thread to retrieve." })
}, {
    description: "Get details of a specific forum post (thread) by its ID."
});

export const ReplyToForumSchema = z.object({
    threadId: z.string({ description: "The ID of the forum thread to reply to." }),
    message: z.string({ description: "The content of the reply message." })
}, {
    description: "Reply to a specific forum post (thread) by its ID."
});

export const CreateTextChannelSchema = z.object({
    guildId: z.string({ description: "The ID of the server (guild) where the text channel will be created." }),
    channelName: z.string({ description: "The name for the new text channel." }),
    topic: z.string({ description: "The (optional) topic/description for the channel." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when creating the channel." }).optional()
}, {
    description: "Create a new text channel in a specified server (guild)."
});

// Category schemas
export const CreateCategorySchema = z.object({
    guildId: z.string({ description: "The ID of the server (guild) where the category will be created." }),
    name: z.string({ description: "The name of the category to create." }),
    position: z.number({ description: "Optional sorting position index for the category." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when creating the category." }).optional()
}, {
    description: "Create a new category in a specified server (guild)."
});

export const EditCategorySchema = z.object({
    categoryId: z.string({ description: "The ID of the category to edit." }),
    name: z.string({ description: "New name for the category (optional)." }).optional(),
    position: z.number({ description: "New position index for the category (optional)." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when editing the category." }).optional()
}, {
    description: "Edit an existing category's properties."
});

export const DeleteCategorySchema = z.object({
    categoryId: z.string({ description: "The ID of the category to delete." }),
    reason: z.string({ description: "Optional reason for audit logs when deleting the category." }).optional()
}, {
    description: "Delete a category by its ID."
});

export const DeleteChannelSchema = z.object({
    channelId: z.string({ description: "The ID of the channel to delete." }),
    reason: z.string({ description: "Optional reason for audit logs when deleting the channel." }).optional()
}, {
    description: "Delete a channel by its ID."
});

export const ReadMessagesSchema = z.object({
    channelId: z.string({ description: "The ID of the channel to read messages from." }),
    limit: z.number({ description: "How many recent messages to fetch (1-100)." }).min(1).max(100).optional().default(50)
}, {
    description: "Read recent messages from a specified channel."
});

export const GetServerInfoSchema = z.object({
    guildId: z.string({ description: "The ID of the server (guild) to get information for." })
}, {
    description: "Get information about a specific server (guild) by its ID."
});

export const AddReactionSchema = z.object({
    channelId: z.string({ description: "The ID of the channel containing the message to react to." }),
    messageId: z.string({ description: "The ID of the message to add a reaction to." }),
    emoji: z.string({ description: "The emoji to use for the reaction (unicode or custom)." })
}, {
    description: "Add a reaction to a specific message in a channel."
});

export const AddMultipleReactionsSchema = z.object({
    channelId: z.string({ description: "The ID of the channel containing the message to react to." }),
    messageId: z.string({ description: "The ID of the message to add reactions to." }),
    emojis: z.array(z.string({ description: "An emoji to add (unicode or custom)." }))
}, {
    description: "Add multiple reactions to a specific message in a channel."
});

export const RemoveReactionSchema = z.object({
    channelId: z.string({ description: "The ID of the channel containing the message to modify reactions on." }),
    messageId: z.string({ description: "The ID of the message to remove the reaction from." }),
    emoji: z.string({ description: "The emoji reaction to remove." }),
    userId: z.string({ description: "Optional ID of the user whose reaction should be removed; if omitted, removes the current bot's reaction." }).optional()
}, {
    description: "Remove a reaction from a specific message in a channel."
});

export const DeleteForumPostSchema = z.object({
    threadId: z.string({ description: "The ID of the forum thread to delete." }),
    reason: z.string({ description: "Optional reason for audit logs when deleting the forum post." }).optional()
}, {
    description: "Delete a forum post (thread) by its ID."
});

export const DeleteMessageSchema = z.object({
    channelId: z.string({ description: "The ID of the channel containing the message to delete." }),
    messageId: z.string({ description: "The ID of the message to delete." }),
    reason: z.string({ description: "Optional reason for audit logs when deleting the message." }).optional()
}, {
    description: "Delete a message by its ID in a specified channel."
});

export const CreateWebhookSchema = z.object({
    channelId: z.string({ description: "The ID of the channel to create the webhook in." }),
    name: z.string({ description: "The name to assign to the webhook." }),
    avatar: z.string({ description: "Optional avatar URL or data for the webhook." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when creating the webhook." }).optional()
}, {
    description: "Create a webhook in a specified channel."
});

export const SendWebhookMessageSchema = z.object({
    webhookId: z.string({ description: "The ID of the webhook to send the message with." }),
    webhookToken: z.string({ description: "The token for the webhook (used for authentication)." }),
    content: z.string({ description: "The message content to send via the webhook." }),
    username: z.string({ description: "Optional username to display for the webhook message." }).optional(),
    avatarURL: z.string({ description: "Optional avatar URL to display for the webhook message." }).optional(),
    threadId: z.string({ description: "Optional ID of the thread to post the webhook message into." }).optional()
}, {
    description: "Send a message using a webhook."
});

export const EditWebhookSchema = z.object({
    webhookId: z.string({ description: "The ID of the webhook to edit." }),
    webhookToken: z.string({ description: "Optional token for the webhook if required to authorize edits." }).optional(),
    name: z.string({ description: "Optional new name for the webhook." }).optional(),
    avatar: z.string({ description: "Optional new avatar URL or data for the webhook." }).optional(),
    channelId: z.string({ description: "Optional channel ID to move the webhook to." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when editing the webhook." }).optional()
}, {
    description: "Edit a webhook's properties."
});

export const DeleteWebhookSchema = z.object({
    webhookId: z.string({ description: "The ID of the webhook to delete." }),
    webhookToken: z.string({ description: "Optional token for the webhook if required for deletion." }).optional(),
    reason: z.string({ description: "Optional reason for audit logs when deleting the webhook." }).optional()
}, {
    description: "Delete a webhook by its ID and token."
});

export const ListServersSchema = z.object({}, {
    description: "List all servers (guilds) the bot is a member of."
});

export const SearchMessagesSchema = z.object({
    guildId: z.string({ description: "The ID of the server (guild) to search in." }).min(1, "guildId is required"),
    // Optional filters
    content: z.string({ description: "Search for messages that contain this text." }).optional().nullable(),
    authorId: z.string({ description: "Filter messages to those authored by this user ID." }).optional().nullable(),
    mentions: z.string({ description: "Filter messages that mention a specific user or role ID." }).optional().nullable(),
    has: z.enum(['link', 'embed', 'file', 'poll', 'image', 'video', 'sound', 'sticker', 'snapshot'], { description: "Filter messages that contain a specific type of content." }).optional().nullable(),
    maxId: z.string({ description: "Only include messages with IDs less than or equal to this (pagination)." }).optional().nullable(),
    minId: z.string({ description: "Only include messages with IDs greater than or equal to this (pagination)." }).optional().nullable(),
    channelId: z.string({ description: "If provided, restrict search to a specific channel ID." }).optional().nullable(),
    pinned: z.boolean({ description: "If true, only include pinned messages; if false, only include unpinned; if omitted, include both." }).optional().nullable(),
    authorType: z.enum(['user', 'bot', 'webhook'], { description: "Filter by the type of author (user, bot, or webhook)." }).optional().nullable(),
    sortBy: z.enum(['timestamp', 'relevance'], { description: "Field to sort search results by." }).optional().nullable(),
    sortOrder: z.enum(['desc', 'asc'], { description: "Sort direction for results." }).optional().nullable(),
    limit: z.number({ description: "Number of results to return (1-25)." }).min(1).max(25).default(25).optional().nullable(),
    offset: z.number({ description: "Number of results to skip (for pagination)." }).min(0).default(0).optional().nullable()
}, {
    description: "Search messages in a server with various filters."
});

// Bot presence/status schemas
export const SetPresenceSchema = z.object({
    status: z.enum(["online", "idle", "dnd", "invisible"], { description: "The presence status to set." }),
    afk: z.boolean({
        description: "Whether I am AFK.",
    }).optional(),
    activity_type: z.enum(["Playing", "Streaming", "Listening", "Watching", "Competing", "Custom"], {
        description: "The type of activity to set.",
    }).optional(),
    activity_name: z.string({
        description: "The name of the activity to set.",
    }).optional()
}, {
    description: "Set the bot's presence/status."
});

export const SetNicknameSchema = z.object({
    guildId: z.string({
        description: "The ID of the server where to set the nickname."
    }).min(1, "guildId is required"),
    nick: z.string({
        description: "The nickname to set (leave empty to reset)."
    }).optional()
}, {
    description: "Set the bot's nickname in a specific server."
});

export const SetAboutMeSchema = z.object({
    aboutMe: z.string({
        description: "The global 'About Me' section content."
    })
}, {
    description: "Set the global 'About Me' section for the bot."
});

export const SetBioSchema = z.object({
    guildId: z.string({
        description: "The ID of the server where to set the bio."
    }).min(1, "guildId is required"),
    bio: z.string({
        description: "The 'Bio' section content to set for the bot in the specified server."
    }).optional()
}, {
    description: "Set the 'Bio' section in a specific server."
});
