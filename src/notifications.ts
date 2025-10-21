import { Server } from '@modelcontextprotocol/sdk/server'

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

export function log(server: Server, message: string, level: Level = 'info') {
    if (levelPriority[level] < levelPriority[currentLevel]) return;
    server.sendLoggingMessage(
        {
            level: level,
            logger: 'mcp-discord',
            data: { text: message },
        }
    );
}

export function info(server: Server, message: string) {
    log(server, message, 'info');
}

export function warning(server: Server, message: string) {
    log(server, message, 'warning');
}

export function error(server: Server, message: string) {
    log(server, message, 'error');
}
