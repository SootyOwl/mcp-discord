import { z } from "zod";

export const DiscordLoginSchema = z.object({
    token: z.string({ description: "Bot token for login." }).optional()
}, {
    description: "Login to Discord. Uses DISCORD_TOKEN env var if token not provided."
});

export const SendMessageSchema = z.object({
    channelId: z.string({ description: "Channel ID to send message to." }),
    message: z.string({ description: "Message content." }),
    replyToMessageId: z.string({ description: "Message ID to reply to." }).optional()
}, {
    description: "Send message to channel, optionally as reply."
});

export const GetForumChannelsSchema = z.object({
    guildId: z.string({ description: "Server ID to get forum channels from." })
}, {
    description: "Get all forum channels in server."
});

export const CreateForumPostSchema = z.object({
    forumChannelId: z.string({ description: "Forum channel ID to create thread in." }),
    title: z.string({ description: "Forum post title." }),
    content: z.string({ description: "Forum post content." }),
    tags: z.array(z.string({ description: "Tag to attach." })).optional()
}, {
    description: "Create forum post thread in forum channel."
});

export const GetForumPostSchema = z.object({
    threadId: z.string({ description: "Forum thread ID." })
}, {
    description: "Get forum post details by ID."
});

export const ReplyToForumSchema = z.object({
    threadId: z.string({ description: "Forum thread ID to reply to." }),
    message: z.string({ description: "Reply content." })
}, {
    description: "Reply to forum post by ID."
});

export const CreateTextChannelSchema = z.object({
    guildId: z.string({ description: "Server ID to create channel in." }),
    channelName: z.string({ description: "Channel name." }),
    topic: z.string({ description: "Channel topic/description." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Create text channel in server."
});

// Category schemas
export const CreateCategorySchema = z.object({
    guildId: z.string({ description: "Server ID to create category in." }),
    name: z.string({ description: "Category name." }),
    position: z.number({ description: "Sorting position index." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Create category in server."
});

export const EditCategorySchema = z.object({
    categoryId: z.string({ description: "Category ID to edit." }),
    name: z.string({ description: "New category name." }).optional(),
    position: z.number({ description: "New position index." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Edit category properties."
});

export const DeleteCategorySchema = z.object({
    categoryId: z.string({ description: "Category ID to delete." }),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Delete category by ID."
});

export const DeleteChannelSchema = z.object({
    channelId: z.string({ description: "Channel ID to delete." }),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Delete channel by ID."
});

export const ReadMessagesSchema = z.object({
    channelId: z.string({ description: "Channel ID to read from." }),
    limit: z.number({ description: "Number of recent messages to fetch (1-100)." }).min(1).max(100).default(5).optional()
}, {
    description: "Read recent messages from channel."
});

export const GetServerInfoSchema = z.object({
    guildId: z.string({ description: "Server ID to get info for." })
}, {
    description: "Get server info by ID."
});

export const AddReactionSchema = z.object({
    channelId: z.string({ description: "Channel ID containing message." }),
    messageId: z.string({ description: "Message ID to react to." }),
    emoji: z.string({ description: "Emoji for reaction (unicode or custom)." })
}, {
    description: "Add reaction to message."
});

export const AddMultipleReactionsSchema = z.object({
    channelId: z.string({ description: "Channel ID containing message." }),
    messageId: z.string({ description: "Message ID to react to." }),
    emojis: z.array(z.string({ description: "Emoji to add (unicode or custom)." }))
}, {
    description: "Add multiple reactions to message."
});

export const RemoveReactionSchema = z.object({
    channelId: z.string({ description: "Channel ID containing message." }),
    messageId: z.string({ description: "Message ID to remove reaction from." }),
    emoji: z.string({ description: "Emoji reaction to remove." }),
    userId: z.string({ description: "User ID whose reaction to remove; omit for bot's own reaction." }).optional()
}, {
    description: "Remove reaction from message."
});

export const DeleteForumPostSchema = z.object({
    threadId: z.string({ description: "Forum thread ID to delete." }),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Delete forum post by ID."
});

export const DeleteMessageSchema = z.object({
    channelId: z.string({ description: "Channel ID containing message." }),
    messageId: z.string({ description: "Message ID to delete." }),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Delete message by ID."
});

export const CreateWebhookSchema = z.object({
    channelId: z.string({ description: "Channel ID to create webhook in." }),
    name: z.string({ description: "Webhook name." }),
    avatar: z.string({ description: "Avatar URL or data." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Create webhook in channel."
});

export const SendWebhookMessageSchema = z.object({
    webhookId: z.string({ description: "Webhook ID." }),
    webhookToken: z.string({ description: "Webhook token for authentication." }),
    content: z.string({ description: "Message content." }),
    username: z.string({ description: "Display username." }).optional(),
    avatarURL: z.string({ description: "Display avatar URL." }).optional(),
    threadId: z.string({ description: "Thread ID to post in." }).optional()
}, {
    description: "Send message via webhook."
});

export const EditWebhookSchema = z.object({
    webhookId: z.string({ description: "Webhook ID to edit." }),
    webhookToken: z.string({ description: "Webhook token for authorization." }).optional(),
    name: z.string({ description: "New webhook name." }).optional(),
    avatar: z.string({ description: "New avatar URL or data." }).optional(),
    channelId: z.string({ description: "Channel ID to move webhook to." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Edit webhook properties."
});

export const DeleteWebhookSchema = z.object({
    webhookId: z.string({ description: "Webhook ID to delete." }),
    webhookToken: z.string({ description: "Webhook token for authorization." }).optional(),
    reason: z.string({ description: "Audit log reason." }).optional()
}, {
    description: "Delete webhook by ID."
});

export const ListServersSchema = z.object({}, {
    description: "List all servers bot is member of."
});

export const SearchMessagesSchema = z.object({
    guildId: z.string({ description: "Server ID to search in." }).min(1, "guildId is required"),
    // Optional filters
    content: z.string({ description: "Text to search for in messages." }).optional(),
    authorId: z.string({ description: "Filter by author user ID." }).optional(),
    mentions: z.string({ description: "Filter by mentioned user or role ID." }).optional(),
    has: z.enum(['link', 'embed', 'file', 'poll', 'image', 'video', 'sound', 'sticker', 'snapshot', ''], { description: "Filter by content type." }).optional(),
    maxId: z.string({ description: "Max message ID (pagination)." }).optional(),
    minId: z.string({ description: "Min message ID (pagination)." }).optional(),
    channelId: z.string({ description: "Restrict to specific channel ID." }).optional(),
    pinned: z.boolean({ description: "Filter by pinned status (true/false/omit for both)." }).optional(),
    authorType: z.enum(['user', 'bot', 'webhook', ''], { description: "Filter by author type." }).optional(),
    sortBy: z.enum(['timestamp', 'relevance', ''], { description: "Sort field." }).optional(),
    sortOrder: z.enum(['desc', 'asc', ''], { description: "Sort direction." }).optional(),
    limit: z.number({ description: "Results to return (1-25)." }).min(1).max(25).default(10).optional(),
    offset: z.number({ description: "Results to skip (pagination)." }).min(0).default(0).optional()
}, {
    description: "Search messages in server with filters."
});

// Bot presence/status schemas
export const SetPresenceSchema = z.object({
    status: z.enum(["online", "idle", "dnd", "invisible"], { description: "Presence status." }),
    afk: z.boolean({
        description: "AFK status.",
    }).optional(),
    activity_type: z.enum(["Playing", "Streaming", "Listening", "Watching", "Competing", "Custom"], {
        description: "Activity type.",
    }).optional(),
    activity_name: z.string({
        description: "Activity name.",
    }).optional()
}, {
    description: "Set bot presence/status."
});

export const SetNicknameSchema = z.object({
    guildId: z.string({
        description: "Server ID to set nickname in."
    }).min(1, "guildId is required"),
    nick: z.string({
        description: "Nickname (empty to reset)."
    }).optional()
}, {
    description: "Set bot nickname in server."
});

export const SetAboutMeSchema = z.object({
    aboutMe: z.string({
        description: "Global 'About Me' content."
    })
}, {
    description: "Set bot global 'About Me' section."
});

export const SetBioSchema = z.object({
    guildId: z.string({
        description: "Server ID to set bio in."
    }).min(1, "guildId is required"),
    bio: z.string({
        description: "'Bio' section content."
    }).optional()
}, {
    description: "Set bot 'Bio' in server."
});
