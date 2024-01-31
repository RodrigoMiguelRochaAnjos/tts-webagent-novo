export class TerminalCommandRequest{
    sessionId!: string;
    allowEnhanced?: boolean;
    command?: string;
    commandFields?: string[];
    cmdObj?: object;
}