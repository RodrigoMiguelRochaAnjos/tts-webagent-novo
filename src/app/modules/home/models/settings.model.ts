import { Address } from "src/app/core/models/user/contact/segments/address.model";
import { NewsProvider } from "./news-provider.model"
import { EmailTemplate } from "../../emails/models/email-template.model";

export class Settings {
    lastUpdate!: number;
    enhancedResults!: boolean;
    autoExecuteHistory!: boolean;

    quickKeys!: string[];
    restrictedQuickKeysIndexes!: string[];

    newsProviders!: NewsProvider;
    hideWhatsNew!: boolean;

    profileName!: string;
    profileEmail!: string;
    profileCountryDialCode!: string;
    profilePhone!: string;
    languageCode!: string;

    emailTemplates: EmailTemplate[] = [];

    currency!: string;
    
    address!: Address;

    agencyEntityName!: string;
    
    portraitFontSize: number = 1;
    landscapeFontSize: number = 1;

    keepKeyboardVisible: boolean = false;

    saveSonPcc!: boolean;

    default: boolean = false;

    sendByEmailItems: any[] = [];

    public isValid(): boolean {
        return (
            this.quickKeys != null && 
            this.profileName != null &&
            this.profileEmail != null &&
            this.profileCountryDialCode != null &&
            this.profilePhone != null &&
            this.languageCode != null
        )
    }

    static default(): Settings {
        const settings = new Settings();

        settings.profileName = '';
        settings.profileEmail = '';
        settings.profileCountryDialCode = '';
        settings.profilePhone = '';
        settings.languageCode = 'en';
        settings.currency = 'EUR';

        settings.saveSonPcc = true;

        settings.enhancedResults = true;
        settings.autoExecuteHistory = true;
        settings.keepKeyboardVisible = false;
        settings.portraitFontSize = 1.5;
        settings.landscapeFontSize = 0.8;
        settings.hideWhatsNew = false;

        settings.quickKeys = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '0',
            '*',
            '¤',
        ];
        settings.restrictedQuickKeysIndexes = ['11'];

        settings.address = new Address();

        settings.address.street = '';
        settings.address.flat = '';
        settings.address.locality = '';
        settings.address.city = '';
        settings.address.province = '';
        settings.address.postCode = '';
        settings.address.countryCode = '';

        settings.lastUpdate = new Date().getTime();

        settings.sendByEmailItems = [];
        settings.emailTemplates = [];

        settings.newsProviders = new NewsProvider();

        return settings;
    }

    clearSendByEmailItems(): void {
        this.sendByEmailItems = [];
    }

    toPostData(): object {
        return {
            lastUpdate: this.lastUpdate,
            enhancedResults: this.enhancedResults,
            autoExecuteHistory: this.autoExecuteHistory,
            qks: [this.quickKeys, this.restrictedQuickKeysIndexes],
            currency: this.currency,
            newsProviders: this.newsProviders,
            hideWhatsNewNotify: this.hideWhatsNew,
            profileUserName: this.profileName,
            profileUserEmail: this.profileEmail,
            profileUserDialCode: this.profileCountryDialCode
                ? Number(this.profileCountryDialCode)
                : null,
            profileUserPhone: this.profilePhone,
            emailTemplates: this.emailTemplates,
            sendByEmail: this.sendByEmailItems,
            languageCode: this.languageCode,
            street: this.address.street ? this.address.street : '',
            flat: this.address.flat ? this.address.flat : '',
            locality: this.address.locality ? this.address.locality : '',
            city: this.address.city ? this.address.city : '',
            province: this.address.province ? this.address.province : '',
            postCode: this.address.postCode ? this.address.postCode : '',
            countryCode: this.address.countryCode ? this.address.countryCode : '',
            agencyEntityName: this.agencyEntityName ? this.agencyEntityName : '',
        };
    }
}