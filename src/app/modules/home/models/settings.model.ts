import { NewsProviders } from "./news-provider.model"

export class Settings {
    lastUpdate!: number;
    enhancedResults!: boolean;
    autoExecuteHistory!: boolean;
    qks!: string[][];
    newsProviders!: NewsProviders;
    hideWhatsNewNotify!: boolean;
    profileUserName!: string;
    profileUserEmail!: string;
    profileUserDialCode!: number;
    profileUserPhone!: string;
    emailTemplates!: any[];
    sendByEmail!: any[];
    currency!: string;
    languageCode!: string;

    default: boolean = false;

    isValid(): boolean {

        return (
            this.qks != null && 
            this.profileUserName != null &&
            this.profileUserEmail != null &&
            this.profileUserDialCode != null &&
            this.profileUserPhone != null &&
            this.sendByEmail != null &&
            this.languageCode != null
        )
    }

    static default(): Settings {
        const settings = new Settings();

        settings.profileUserName = '';
        settings.profileUserEmail = '';
        settings.profileUserDialCode = 351;
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

        settings.newsProviders = {};

        settings.default = true;

        return settings;
    }
}