import { NewsProvider } from "src/app/modules/home/models/news-provider.model";
import { Settings } from "src/app/modules/home/models/settings.model";
import { SyncDataSettings } from "src/app/modules/terminal/models/sync-data-settings.model";
import { Address } from "../models/user/contact/segments/address.model";
import { Contact } from "../models/user/contact/contact.model";

export class SettingsMapper {
    public static mapSyncDataSettingsToSettings(serverData: SyncDataSettings, currentSettings: Settings): Settings {
        const settings = new Settings();
        settings.profileName = serverData.profileUserName
            ? serverData.profileUserName
            : '';
        settings.profileEmail = serverData.profileUserEmail
            ? serverData.profileUserEmail
            : '';
        settings.profileCountryDialCode = serverData.profileUserDialCode
            ? '' + serverData.profileUserDialCode
            : '';
        settings.profilePhone = serverData.profileUserPhone
            ? serverData.profileUserPhone
            : '';
        settings.languageCode = serverData.languageCode
            ? serverData.languageCode
            : 'en';
        settings.currency = serverData.currency ? serverData.currency : 'EUR';

        settings.saveSonPcc = currentSettings ? currentSettings.saveSonPcc : true;

        settings.enhancedResults = serverData.enhancedResults;
        settings.autoExecuteHistory = serverData.autoExecuteHistory;
        settings.keepKeyboardVisible = currentSettings ? currentSettings.keepKeyboardVisible : true;
        settings.portraitFontSize = currentSettings ? currentSettings.portraitFontSize : 1;
        settings.landscapeFontSize = currentSettings ? currentSettings.landscapeFontSize : 1;
        settings.hideWhatsNew = serverData.hideWhatsNewNotify;
        settings.quickKeys = serverData.qks[0];
        settings.restrictedQuickKeysIndexes = serverData.qks[1];

        settings.address = new Address();

        settings.address.street = serverData.street ? serverData.street : '';
        settings.address.flat = serverData.flat ? serverData.flat : '';
        settings.address.locality = serverData.locality ? serverData.locality : '';
        settings.address.city = serverData.city ? serverData.city : '';
        settings.address.province = serverData.province ? serverData.province : '';
        settings.address.postCode = serverData.postCode ? serverData.postCode : '';
        settings.address.countryCode = serverData.countryCode ? serverData.countryCode : '';

        settings.agencyEntityName = serverData.agencyEntityName ? serverData.agencyEntityName : '';

        settings.lastUpdate = serverData.lastUpdate;

        settings.sendByEmailItems = serverData.sendByEmailItems
            ? serverData.sendByEmailItems
            : [];
        settings.emailTemplates = serverData.emailTemplates
            ? serverData.emailTemplates
            : [];

        settings.newsProviders = serverData.newsProviders
            ? serverData.newsProviders
            : new NewsProvider();

        return settings;


    }
}