# Discord Guild Message Search Usage

## Overview

The `discord_search_guild_messages` tool allows you to search for messages within a Discord guild (server). This feature uses Discord's undocumented search API endpoint.

**Important Notes:**
- This uses an undocumented Discord API endpoint (`/guilds/{guild_id}/messages/search`)
- The endpoint may not be accessible with all bot tokens
- Discord may change or remove this endpoint at any time
- This functionality is provided as-is and may have limitations

## Tool Name

`discord_search_guild_messages`

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `guildId` | string | Yes | - | The ID of the guild/server to search in |
| `content` | string | No | - | Text content to search for in messages |
| `authorId` | string | No | - | Filter results by author's user ID |
| `channelId` | string | No | - | Filter results to a specific channel ID |
| `limit` | number | No | 25 | Maximum number of results (1-25) |

## Example Usage

### Search by content
```json
{
  "guildId": "123456789012345678",
  "content": "hello world"
}
```

### Search by author
```json
{
  "guildId": "123456789012345678",
  "authorId": "987654321098765432"
}
```

### Search in specific channel
```json
{
  "guildId": "123456789012345678",
  "content": "bug report",
  "channelId": "111111111111111111"
}
```

### Combined search
```json
{
  "guildId": "123456789012345678",
  "content": "feature request",
  "authorId": "987654321098765432",
  "channelId": "111111111111111111",
  "limit": 10
}
```

## Response Format

The tool returns a JSON object containing:

```json
{
  "guildId": "123456789012345678",
  "totalResults": 5,
  "messages": [
    {
      "id": "message_id",
      "content": "message content",
      "author": {
        "id": "author_id",
        "username": "username",
        "discriminator": "0000"
      },
      "channelId": "channel_id",
      "timestamp": "2024-01-01T12:00:00.000Z",
      "attachments": 0,
      "embeds": 0
    }
  ]
}
```

## Error Handling

If the search endpoint is not available or accessible, you will receive an error message:

```json
{
  "content": [{
    "type": "text",
    "text": "Guild message search is not available. This feature uses an undocumented Discord API endpoint that may not be accessible with bot tokens."
  }],
  "isError": true
}
```

## Limitations

1. **Undocumented API**: This uses an undocumented Discord endpoint that may not work with all bot tokens
2. **Result Limit**: Maximum 25 results per search
3. **Bot Token Restrictions**: User bot tokens may have different access than regular user accounts
4. **API Changes**: Discord may change or remove this endpoint without notice
5. **Rate Limits**: Subject to Discord's rate limiting policies

## Alternative Approaches

If the guild search is not available, consider these alternatives:

1. **Channel-based search**: Use `discord_read_messages` to fetch recent messages from specific channels
2. **Local indexing**: Fetch and store messages locally for searching (requires maintaining your own database)
3. **Discord's official search**: Direct users to use Discord's built-in search feature

## Troubleshooting

**Q: I get an error saying the endpoint is not available**
A: This is expected behavior as the endpoint is undocumented. Try using alternative search methods or the Discord client's built-in search.

**Q: Can I search across multiple guilds?**
A: No, each search is scoped to a single guild. You need to make separate requests for each guild.

**Q: Why is the result limit only 25?**
A: This is based on Discord's API limitations for this undocumented endpoint.
