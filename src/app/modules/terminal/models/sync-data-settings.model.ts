import { NewsProvider } from "../../home/models/news-provider.model";

export class SyncDataSettings {
    lastUpdate!: number;
    enhancedResults!: boolean;
    autoExecuteHistory!: boolean;
    qks!: string[][];
    newsProviders!: NewsProvider;
    hideWhatsNewNotify!: boolean;
    profileUserName!: string;
    profileUserEmail!: string;
    profileUserDialCode!: string;
    profileUserPhone!: string;
    emailTemplates!: any[];
    sendByEmailItems: any[] = [];
    currency!: string;
    languageCode!: string;
    street!: string
    flat!: string
    locality!: string
    city!: string
    province!: string
    postCode!: string
    countryCode!: string
    agencyEntityName!: string;
    portraitFontSize: number = 1;
    keepKeyboardVisible: boolean = false;

    default: boolean = false;

    public isValid(): boolean {
        return (
            this.qks != null &&
            this.profileUserName != null &&
            this.profileUserEmail != null &&
            this.profileUserDialCode != null &&
            this.profileUserPhone != null &&
            this.languageCode != null
        )
    }

    static default(): SyncDataSettings {
        const settings = new SyncDataSettings();

        settings.profileUserName = '';
        settings.profileUserEmail = '';
        settings.profileUserDialCode = '351';
        settings.profileUserPhone = '';
        settings.languageCode = 'en';
        settings.currency = 'EUR';

        settings.enhancedResults = true;
        settings.autoExecuteHistory = true;

        settings.qks = []
        settings.qks.push([
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
        ]);

        settings.lastUpdate = new Date().getTime();
        settings.emailTemplates = [];

        // settings.newsProviders = new NewProvider;

        settings.default = true;

        return settings;
    }
}