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

export function log(server: Server, message: string, level: Level = 'info', extra?: Record<string, any>) {
    if (levelPriority[level] < levelPriority[currentLevel]) return;
    try {
        server.sendLoggingMessage(
            {
                level: level,
                logger: 'mcp-discord',
                data: {
                    message: message,
                    ...extra,
                },
            }
        );
        // Catch thrown errors to prevent logging failures from crashing the bot
    } catch (e) {
        console.error(`[ERROR] Failed to send log message to MCP server: ${e}`);
    }
}

export function info(server: Server, message: string, extra?: Record<string, any>) {
    log(server, message, 'info', extra);
}

export function warning(server: Server, message: string, extra?: Record<string, any>) {
    log(server, message, 'warning', extra);
}

export function error(server: Server, message: string, extra?: Record<string, any>) {
    log(server, message, 'error', extra);
}
