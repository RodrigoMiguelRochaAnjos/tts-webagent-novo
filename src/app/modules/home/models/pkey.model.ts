export declare type PKeys = PKey[];
export interface PKey {
    name: string
    command: [string, string[]]
    autoexecute: boolean
    lastupdated: string
    shared: boolean
    isSystemDefault: boolean
}