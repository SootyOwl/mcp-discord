# CLAUDE.md - AI Assistant Guide for mcp-discord

## Project Overview

**mcp-discord** is a Model Context Protocol (MCP) server that enables AI assistants to interact with Discord. It provides a comprehensive set of tools for managing Discord servers, channels, messages, forums, webhooks, and more.

- **Version**: 1.3.4
- **Tech Stack**: TypeScript, Discord.js v14, Express, Zod, MCP SDK
- **Repository**: https://github.com/barryyip0625/mcp-discord
- **License**: MIT

## Architecture Overview

### Core Components

```
src/
├── index.ts              # Entry point, config, auto-login, transport initialization
├── server.ts             # DiscordMCPServer class, tool routing
├── transport.ts          # Transport layers (stdio & HTTP)
├── toolList.ts           # Tool definitions for MCP
├── schemas.ts            # Zod validation schemas
├── logger.ts             # JSON-RPC logging utilities
├── errorHandler.ts       # Discord API error handler
└── tools/
    ├── tools.ts          # Tool handler exports & context creation
    ├── types.ts          # Type definitions
    ├── login.ts          # Discord authentication
    ├── send-message.ts   # Message sending
    ├── server.ts         # Server info & search
    ├── channel.ts        # Channel management
    ├── forum.ts          # Forum operations
    ├── reactions.ts      # Reaction management
    └── webhooks.ts       # Webhook operations
```

### Data Flow

1. **Request** → Transport Layer (stdio or HTTP)
2. **Transport** → DiscordMCPServer
3. **Server** → Tool Handler (with validation)
4. **Handler** → Discord.js Client
5. **Response** → Formatted ToolResponse → Client

## Key Design Patterns

### 1. Tool Handler Pattern

All tool handlers follow this signature:

```typescript
export async function handlerName(
  args: any,
  context: ToolContext
): Promise<ToolResponse>
```

- **args**: Validated against Zod schema
- **context**: Contains Discord client
- **Returns**: `{ content: [{ type: "text", text: string }], isError?: boolean }`

### 2. Validation Pattern

Every tool has:
- **Schema** in `schemas.ts` (Zod validation)
- **Definition** in `toolList.ts` (MCP tool metadata)
- **Handler** in `tools/` directory (implementation)

Example:
```typescript
// schemas.ts
export const SendMessageSchema = z.object({
  channelId: z.string(),
  message: z.string(),
  replyToMessageId: z.string().optional()
});

// toolList.ts
{
  name: "discord_send",
  description: "Sends a message to a specified Discord text channel",
  inputSchema: { /* JSON Schema */ }
}

// tools/send-message.ts
export async function sendMessageHandler(args, context) {
  const validatedArgs = SendMessageSchema.parse(args);
  // Implementation
}
```

### 3. Error Handling Pattern

Use `handleDiscordError()` from `errorHandler.ts` for consistent error responses:

```typescript
try {
  // Discord API call
} catch (error) {
  return handleDiscordError(error, clientId);
}
```

This handles:
- Missing permissions (50001)
- Unknown guild (10004)
- Rate limiting (429)
- Privileged intent errors

### 4. Transport Abstraction

Two transport modes:
- **stdio**: Traditional MCP transport via stdin/stdout
- **HTTP**: Stateless HTTP server on configurable port

Both implement the `MCPTransport` interface.

## Development Conventions

### Adding a New Tool

1. **Define Schema** in `src/schemas.ts`:
   ```typescript
   export const MyToolSchema = z.object({
     param1: z.string(),
     param2: z.number().optional()
   });
   ```

2. **Add Tool Definition** in `src/toolList.ts`:
   ```typescript
   {
     name: "discord_my_tool",
     description: "Clear description of what it does",
     inputSchema: {
       type: "object",
       properties: {
         param1: { type: "string" },
         param2: { type: "number" }
       },
       required: ["param1"]
     }
   }
   ```

3. **Implement Handler** (new file or existing in `src/tools/`):
   ```typescript
   import { MyToolSchema } from '../schemas.js';
   import { ToolResponse, ToolContext } from './types.js';
   import { handleDiscordError } from '../errorHandler.js';

   export async function myToolHandler(
     args: any,
     context: ToolContext
   ): Promise<ToolResponse> {
     const { param1, param2 } = MyToolSchema.parse(args);

     try {
       // Discord API operations
       const result = await context.client.doSomething();

       return {
         content: [{
           type: "text",
           text: `Success: ${result}`
         }]
       };
     } catch (error) {
       return handleDiscordError(error);
     }
   }
   ```

4. **Export Handler** in `src/tools/tools.ts`:
   ```typescript
   export { myToolHandler } from './my-tool.js';
   ```

5. **Register in Server** in `src/server.ts`:
   ```typescript
   case "discord_my_tool":
     toolResponse = await myToolHandler(args, this.toolContext);
     return toolResponse;
   ```

6. **Register in Transport** (if using HTTP) in `src/transport.ts`:
   Add cases in both direct method handling and `tools/call` method handling.

### Code Style Guidelines

- **File Extensions**: Always use `.js` in imports (TypeScript's NodeNext resolution)
- **Async/Await**: Prefer over promises
- **Error Messages**: Be descriptive and user-friendly
- **Logging**: Use `info()` and `error()` from `logger.ts`
- **Type Safety**: Leverage TypeScript and Zod for validation
- **Naming**:
  - Tools: `discord_*` prefix
  - Handlers: `*Handler` suffix
  - Schemas: `*Schema` suffix

### TypeScript Configuration

- **Target**: ES2022
- **Module**: NodeNext (ESM)
- **Output**: `build/` directory
- **Source**: `src/` directory
- **Strict mode**: Enabled

### Build & Run Commands

```bash
# Development
npm run dev           # Run with ts-node

# Production
npm run build         # Compile TypeScript
npm start             # Run compiled code
node build/index.js   # Direct execution

# With options
node build/index.js --config "TOKEN"
node build/index.js --transport http --port 3000 --config "TOKEN"

# Docker
docker build -t mcp-discord .
docker run -e DISCORD_TOKEN=token -p 8080:8080 mcp-discord
```

## Important Considerations

### Discord Bot Requirements

Before using any tools (except `discord_login`), ensure:

1. **Bot Token**: Valid Discord bot token
2. **Intents Enabled**: Message Content, Server Members, Presence
3. **Bot Added to Server**: Bot must be a member of target servers
4. **Permissions**: Adequate permissions for the operation

### Auto-Login Behavior

The server automatically logs in on startup if:
- `DISCORD_TOKEN` environment variable is set, OR
- `--config` argument is provided

### Client State Management

- Client state is checked before each Discord API operation
- HTTP transport includes automatic reconnection logic
- Use `this.logClientState()` for debugging in `server.ts`

### Rate Limiting

Discord API has rate limits. Best practices:
- Handle 429 errors gracefully
- Consider implementing request queuing for bulk operations
- Inform users to space out requests if rate limited

### Common Pitfalls

1. **Forgetting `.js` extension**: Imports must use `.js` even for `.ts` files
2. **Not validating args**: Always parse with Zod schema
3. **Poor error messages**: Use `handleDiscordError()` for consistency
4. **Missing exports**: Remember to export from `tools/tools.ts`
5. **Transport registration**: HTTP transport requires double registration (direct + tools/call)

## Testing Approach

Currently, the project uses manual testing. When adding tests:

1. **Unit Tests**: Test individual handlers with mocked Discord client
2. **Integration Tests**: Test full flow with test bot token
3. **Error Cases**: Verify error handling for common Discord errors

## Environment Variables

- `DISCORD_TOKEN`: Bot authentication token
- `PORT`: (Optional) HTTP server port (default: 8080)

Command-line arguments override environment variables.

## Available Tools Reference

### Authentication
- `discord_login`: Log in with Discord token

### Server Management
- `discord_list_servers`: List all servers bot is in
- `discord_get_server_info`: Get detailed server information
- `discord_search_messages`: Search messages with filters

### Channel Management
- `discord_create_text_channel`: Create text channel
- `discord_delete_channel`: Delete channel
- `discord_read_messages`: Read messages from channel
- `discord_create_category`: Create channel category
- `discord_edit_category`: Edit category
- `discord_delete_category`: Delete category

### Messaging
- `discord_send`: Send message (with optional reply)
- `discord_delete_message`: Delete specific message

### Reactions
- `discord_add_reaction`: Add single reaction
- `discord_add_multiple_reactions`: Add multiple reactions
- `discord_remove_reaction`: Remove reaction

### Forums
- `discord_get_forum_channels`: List forum channels
- `discord_create_forum_post`: Create forum post with tags
- `discord_get_forum_post`: Get forum post details
- `discord_reply_to_forum`: Reply to forum thread
- `discord_delete_forum_post`: Delete forum post

### Webhooks
- `discord_create_webhook`: Create webhook
- `discord_send_webhook_message`: Send via webhook
- `discord_edit_webhook`: Edit webhook
- `discord_delete_webhook`: Delete webhook

## Git Workflow

- **Main branch**: Production-ready code
- **Feature branches**: Use descriptive names
- **Commit messages**: Clear and concise
- **CI/CD**: Docker images auto-published on push

## Docker Publishing

GitHub Actions automatically builds and publishes Docker images:
- **Trigger**: Push to main or version tags
- **Registry**: Docker Hub (`barryy625/mcp-discord`)
- **Tags**: `latest` and version-specific tags

## Useful Resources

- [Discord.js Documentation](https://discord.js.org/)
- [Model Context Protocol Spec](https://spec.modelcontextprotocol.io/)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord API Documentation](https://discord.com/developers/docs/intro)

## Contributing Guidelines

When contributing:

1. **Maintain consistency** with existing patterns
2. **Add proper validation** using Zod schemas
3. **Handle errors gracefully** with `handleDiscordError()`
4. **Update this documentation** if adding major features
5. **Test thoroughly** with real Discord bot before PR
6. **Follow TypeScript best practices** and strict mode
7. **Use descriptive variable/function names**
8. **Add JSDoc comments** for complex functions

## Troubleshooting for AI Assistants

### "Client not logged in" errors
→ Ensure bot token is configured and `discord_login` was called

### "Unknown Guild" errors
→ Bot must be added to target server first

### "Missing Access" errors
→ Check bot permissions in Discord server

### "Privileged intent" errors
→ Enable required intents in Discord Developer Portal

### Import/Module errors
→ Verify `.js` extensions in all imports

### Validation errors
→ Check args match schema in `schemas.ts` and `toolList.ts`

---

**Last Updated**: 2025-11-14
**For**: AI assistants working with mcp-discord codebase
**Maintained by**: Project contributors
