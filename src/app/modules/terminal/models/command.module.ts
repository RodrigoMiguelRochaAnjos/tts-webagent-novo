export class Command {
    command: string;
    autoExecute: boolean;

    constructor(command: string, autoExecute: boolean) {
        this.command = command;
        this.autoExecute = autoExecute;
    }
}
