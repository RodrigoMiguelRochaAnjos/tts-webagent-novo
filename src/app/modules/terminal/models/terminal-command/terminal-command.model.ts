import { TerminalMessage } from "./terminal-message.model";

export class TerminalCommandResponse {
    success: boolean;
    message!: TerminalMessage;
    enablePageDown: boolean;
    msgAlert?: string
    msgObj?: any

    constructor(
        success: boolean,
        enablePageDown: boolean

    ) {
        this.success = success;
        this.enablePageDown = enablePageDown;
    }
}