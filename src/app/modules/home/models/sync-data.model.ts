import { PKeys } from "./pkey.model"
import { Settings } from "./settings.model"

export class SyncData {
    commandsHistory!: string[]
    excludedCommands!: string[]
    pkeys!: PKeys
    settings!: Settings
    serverName!: string
}