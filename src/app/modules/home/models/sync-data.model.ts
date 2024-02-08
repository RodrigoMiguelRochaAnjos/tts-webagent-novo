
import { PKeys } from "../../terminal/models/pkey.model"
import { SyncDataSettings } from "../../terminal/models/sync-data-settings.model"

export class SyncData {
    commandsHistory!: string[]
    excludedCommands!: string[]
    pkeys!: PKeys
    settings!: SyncDataSettings
    serverName!: string
}