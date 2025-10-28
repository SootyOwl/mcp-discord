import { Server } from '@modelcontextprotocol/sdk/server';

export type Level = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency';

const levelPriority: Record<Level, number> = {
    debug: 0,
    info: 1,
    notice: 2,
    warning: 3,
    error: 4,
    critical: 5,
    alert: 6,
    emergency: 7,
};

export let currentLevel: Level = 'info';

export function setLevel(level: Level) {
    if (!levelPriority.hasOwnProperty(level)) return false;
    currentLevel = level;
    return true;
}

export async function log(server: Server, message: string, level: Level = 'info', extra?: Record<string, any>) {
    if (levelPriority[level] < levelPriority[currentLevel]) return;

    await server.sendLoggingMessage({
        level: level,
        logger: 'mcp-discord',
        data: {
            message: message,
            ...extra,
        },
    }).catch((e: any) => {
        console.error(`[ERROR] Failed to send log message to MCP server: ${e}, original message: ${message}`);
    });
}

export async function info(server: Server, message: string, extra?: Record<string, any>) {
    await log(server, message, 'info', extra);
}

export async function warning(server: Server, message: string, extra?: Record<string, any>) {
    await log(server, message, 'warning', extra);
}

export async function error(server: Server, message: string, extra?: Record<string, any>) {
    await log(server, message, 'error', extra);
}
