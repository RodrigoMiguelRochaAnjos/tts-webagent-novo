import { TerminalMessage } from "../terminal-message.model";

export class QueueMessage extends TerminalMessage {
    masks!: {
        links: {
            attrList: [],
            ctlChr: string,
            escChr: string
        },
        inputs: {
            attrList: [],
            ctlChr: string,
            escChr: string
        }
    }
}