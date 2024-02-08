import { AddOns } from "../utils/add-ons/add-ons.model";
import { LicenseAlert } from "./license-alert.model";
import { Message } from "./message.model"
import { SyncData } from "./sync-data.model"

export interface LoginResponse {
    success: boolean;
    isTMAUser: boolean;
    enablePageDown: boolean;
    addOns: AddOns;
    sessionId: string;
    message: any;
    syncData: SyncData;
    token: string;
    licenseAlert: string[];
}
