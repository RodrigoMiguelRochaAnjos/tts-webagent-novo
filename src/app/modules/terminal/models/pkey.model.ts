import { patterns } from "src/app/shared/utils/validation-patterns";

export declare type PKeys = PKey[];
export class PKey {
    name!: string;
    command!: string;
    commandVariables!: string[];
    autoExecute!: boolean;
    lastUpdatedOn!: string;
    isShared!: boolean;
    isSystemDefault!: boolean;

    public isValid(): boolean {
        return patterns.text.test(this.name) && patterns.text.test(this.command);
    }

    public copy(pkey: PKey) : PKey {
        if(!(pkey instanceof PKey)) return this;

        this.name = pkey.name;
        this.command = pkey.command;
        this.autoExecute = pkey.autoExecute;
        this.lastUpdatedOn = pkey.lastUpdatedOn;
        this.isShared = pkey.isShared;
        this.isSystemDefault = pkey.isSystemDefault;

        return this;
    }

    toPostData(): object {
        return {
            name: this.name,
            command: [this.command, this.commandVariables],
            autoexecute: this.autoExecute,
            lastupdated: this.lastUpdatedOn,
            shared: this.isShared
        };
    }
}