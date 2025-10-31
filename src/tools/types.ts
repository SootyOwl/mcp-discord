import { APIMessage, Client } from "discord.js";

export interface ToolResponse {
  content: { type: string; text: string }[];
  isError?: boolean;
  [key: string]: unknown;
}

export interface ToolContext {
  client: Client;
}

export type ToolHandler<T = any> = (args: T, context: ToolContext) => Promise<ToolResponse>;

// Search messages response types
export interface SearchMessageAuthor {
  id: string;
  username: string;
  global_name: string | null;
}

export interface SearchMessage extends Omit<APIMessage, 'author'> {
  author: SearchMessageAuthor;
  hit: boolean;
}

export interface SearchMessagesResponse {
  messages: SearchMessage[][];
  doing_deep_historical_index: boolean;
  total_results: number;
} 